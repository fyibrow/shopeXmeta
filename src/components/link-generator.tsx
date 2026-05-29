"use client";

import { useEffect, useState } from "react";

function getPreviewHostname() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  try {
    return new URL(base).hostname.toUpperCase();
  } catch {
    return "DOMAIN-ANDA.COM";
  }
}

export function LinkGenerator({ onCreated }: { onCreated?: () => void }) {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewHost, setPreviewHost] = useState("SHOPEXMETA.VERCEL.APP");

  useEffect(() => {
    setPreviewHost(getPreviewHostname());
  }, []);

  function onImageChange(file: File | null) {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Gambar wajib diupload");
      return;
    }

    setLoading(true);
    setError("");
    setResultUrl("");
    setImageUrl("");

    const formData = new FormData();
    formData.append("destinationUrl", destinationUrl);
    formData.append("ogTitle", ogTitle);
    formData.append("ogDescription", "Facebook.com");
    formData.append("image", image);

    const res = await fetch("/api/links", { method: "POST", body: formData });
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Gagal membuat link");
      return;
    }

    setResultUrl(json.redirectUrl);
    setImageUrl(json.link?.image_url ?? "");
    onCreated?.();
  }

  function copyLink() {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl);
      alert("Link disalin!");
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 p-8 lg:p-10">
          <h2 className="text-lg font-bold text-slate-900">Generator Link</h2>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Link tujuan (Shopee / ngelink.net)
            </label>
            <input
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://shopee.co.id/... atau https://ngelink.net/..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Judul OG
            </label>
            <input
              type="text"
              required
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <p className="mt-2 text-xs text-slate-500">
              Baris bawah preview FB:{" "}
              <span className="font-bold">Facebook.com</span> (deskripsi OG)
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Gambar OG
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white"
            />
            <p className="mt-1 text-xs text-slate-500">
              Otomatis di-crop ke 1200×630 untuk preview FB{" "}
              <strong>gambar besar</strong> (bukan thumbnail kecil).
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Generate Link"}
          </button>

          {resultUrl && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase text-emerald-800">
                  Link siap dipakai
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={resultUrl}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-2 py-2 font-mono text-xs text-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={copyLink}
                    className="shrink-0 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p className="mb-2 font-bold">Cara post (domain atas = URL link)</p>
                <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed">
                  <li>
                    Tempel link → tunggu preview → <strong>hapus teks URL</strong>{" "}
                    di atas kartu (supaya tidak dobel).
                  </li>
                  <li>
                    Baris <strong>{previewHost}</strong> di atas judul{" "}
                    <em>tidak bisa</em> diganti jadi facebook.com via meta tag
                    (aturan Facebook).
                  </li>
                  <li>
                    Agar tanpa baris domain: post sebagai{" "}
                    <strong>Foto</strong> (unduh gambar) + taruh link di komentar.
                  </li>
                  <li>
                    Atau pakai <strong>custom domain</strong> di Vercel (mis.{" "}
                    <code className="rounded bg-amber-100 px-1">go.ngelink.net</code>
                    ) supaya baris atas bukan vercel.app.
                  </li>
                </ol>
                {imageUrl && (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-lg bg-amber-800 px-3 py-2 text-xs font-bold text-white"
                  >
                    Unduh gambar untuk post Foto
                  </a>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="flex flex-col items-center justify-center bg-slate-100 p-8">
          <p className="mb-1 text-xs font-bold uppercase text-slate-400">
            Preview Facebook (realistis)
          </p>
          <p className="mb-4 max-w-sm text-center text-[10px] text-slate-500">
            Sama seperti saat di-post — domain atas ikut hostname link Anda
          </p>
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-[#242526] shadow-2xl">
            <div className="aspect-[1.91/1] bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview ?? "https://placehold.co/600x315/374151/9ca3af?text=OG+Image"}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-t border-[#3e4042] bg-[#323436] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#b0b3b8]">
                {previewHost}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-[#e4e6eb]">
                {ogTitle || "Judul postingan"}
              </p>
              <p className="mt-0.5 text-xs text-[#b0b3b8]">Facebook.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
