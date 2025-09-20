import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ul className="font-mono list-inside list-disc text-sm/6 text-center sm:text-left">
          <li>Alimad Emoji CDN</li>
          <li>GET /:id[:size]</li>
          <li><a href="/heavysob:128" className="text-blue-500 hover:underline">/heavysob:128</a></li>
        </ul>
      </main>
    </div>
  );
}
