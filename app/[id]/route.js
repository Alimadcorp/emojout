// app/[id]/route.js
import emojiList from "./list.js";
import sharp from "sharp";

export async function GET(req, { params }) {
  let [rawId, sizeStr] = params.id.split(":");
  let size = sizeStr ? parseInt(sizeStr, 10) : null;

  // Resolve aliases safely (max depth 10)
  let url = emojiList[rawId];
  let depth = 0;
  while (url?.startsWith("alias:") && depth < 10) {
    url = emojiList[url.slice(6)];
    depth++;
  }
  if (!url) return new Response("Not found", { status: 404 });

  // Fetch image
  const res = await fetch(url);
  if (!res.ok) return new Response("Failed to fetch image", { status: 502 });
  const buffer = Buffer.from(await res.arrayBuffer());

  // Detect format
  let contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) contentType = "image/png";

  // Resize if needed
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
      // sharp can't encode gifs (only first frame),
      // so fallback: convert to PNG
      output = await image.png().toBuffer();
      contentType = "image/png";
    } else {
      // default to webp
      output = await image.webp().toBuffer();
      contentType = "image/webp";
    }
  }

  return new Response(output, {
    headers: { "Content-Type": contentType },
  });
}
