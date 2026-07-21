import type { APIRoute } from "astro";
import { SITE } from "../config";

// ads.txt authorizes who may sell your inventory. Until AdSense is approved the
// pub id is blank, so we emit a harmless placeholder comment. Once SITE.ADSENSE_PUB_ID
// is set (e.g. "ca-pub-1234567890123456"), this auto-emits the correct line.
export const GET: APIRoute = () => {
  const pub = SITE.ADSENSE_PUB_ID.trim().replace(/^ca-/, ""); // -> pub-…
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : `# ads.txt placeholder — no ad network configured yet.\n# After AdSense approval, set SITE.ADSENSE_PUB_ID in src/config.ts and this file\n# will emit: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
