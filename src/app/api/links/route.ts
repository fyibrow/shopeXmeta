import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/slug";
import { FACEBOOK_OG_DESCRIPTION } from "@/lib/og-meta";
import { getSiteUrl } from "@/lib/site-url";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  createLinkSchema,
} from "@/lib/validators";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const destinationUrl = String(formData.get("destinationUrl") ?? "");
  const ogTitle = String(formData.get("ogTitle") ?? "");
  const image = formData.get("image");

  const parsed = createLinkSchema.safeParse({
    destinationUrl,
    ogTitle,
    ogDescription: FACEBOOK_OG_DESCRIPTION,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 },
    );
  }

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Gambar wajib diupload" }, { status: 400 });
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 5MB" },
      { status: 400 },
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(image.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return NextResponse.json(
      { error: "Format gambar: JPEG, PNG, atau WebP" },
      { status: 400 },
    );
  }

  const ext = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
  const slug = generateSlug();
  const path = `${slug}-${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const buffer = Buffer.from(await image.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("og-images")
    .upload(path, buffer, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return NextResponse.json(
      { error: "Gagal upload gambar ke storage" },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("og-images").getPublicUrl(path);

  const siteUrl = getSiteUrl(request);
  const redirectUrl = `${siteUrl}/r/${slug}`;

  const { data: link, error: insertError } = await supabase
    .from("links")
    .insert({
      slug,
      destination_url: parsed.data.destinationUrl,
      og_title: parsed.data.ogTitle,
      og_description: FACEBOOK_OG_DESCRIPTION,
      image_url: publicUrl,
    })
    .select()
    .single();

  if (insertError) {
    await admin.storage.from("og-images").remove([path]);
    console.error(insertError);
    return NextResponse.json(
      { error: "Gagal menyimpan link" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    link,
    redirectUrl,
  });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ links });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID wajib" }, { status: 400 });
  }

  const { error } = await supabase
    .from("links")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
