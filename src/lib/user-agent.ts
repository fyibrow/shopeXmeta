const CRAWLER_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Discordbot/i;

const FB_IN_APP_PATTERN = /FBAN|FBAV|FB_IAB/i;

export function analyzeUserAgent(userAgent: string | null) {
  const ua = userAgent ?? "";
  return {
    isCrawler: CRAWLER_PATTERN.test(ua),
    isFbInApp: FB_IN_APP_PATTERN.test(ua),
  };
}
