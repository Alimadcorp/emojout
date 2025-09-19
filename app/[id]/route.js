// app/[id]/route.js
import emojiList from "./list.js";
import sharp from "sharp";
export const runtime = "nodejs";

export async function GET(req, { params }) {
  params = await params;
  let code = 200;
  let [rawId, sizeStr] = params.id.split(":");
  let size = sizeStr ? Math.min(parseInt(sizeStr, 10), 512) : null;

  let url = emojiList[rawId];
  let depth = 0;
  while (url?.startsWith("alias:") && depth < 10) {
    url = emojiList[url.slice(6)];
    depth++;
  }
  if (!url) { url = emojiList["parrotnotfound"]; code = 404; }

  const res = await fetch(url);
  if (!res.ok) return new Response("Failed to fetch image", { status: 502 });
  const buffer = Buffer.from(await res.arrayBuffer());

  let contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) contentType = "image/png";

  let output = buffer;
  if (size) {
    const image = sharp(buffer).resize(size, size, { fit: "inside" });

    if (contentType.includes("png")) {
      output = await image.png().toBuffer();
      contentType = "image/png";
    } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      output = await image.jpeg().toBuffer();
      contentType = "image/jpeg";
    } else if (contentType.includes("gif")) {
      output = await sharp(buffer, { animated: true })
        .resize(size, size, { fit: "inside" })
        .webp({ effort: 6 })
        .toBuffer();
      contentType = "image/webp";
    } else {
      output = await image.webp().toBuffer();
      contentType = "image/webp";
    }
  }

  return new Response(output, {
    headers: { "Content-Type": contentType, "Status": code },
  });
}
