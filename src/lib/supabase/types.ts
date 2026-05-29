export type Link = {
  id: string;
  slug: string;
  destination_url: string;
  og_title: string;
  og_description: string;
  image_url: string;
  created_at: string;
  deleted_at: string | null;
};

export type Click = {
  id: string;
  link_id: string;
  user_agent: string | null;
  referrer: string | null;
  is_crawler: boolean;
  is_fb_in_app: boolean;
  created_at: string;
};

export type LinkWithStats = Link & {
  click_count: number;
  crawler_clicks: number;
  fb_in_app_clicks: number;
};
