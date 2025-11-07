"use client"
import { useState } from "react"
import used from "./used.js"

export default function Home() {
  const [q, setQ] = useState("")

  const items = Object.entries(used).map(([id, count]) => ({ id, count }))

  const search = e => {
    e.preventDefault()
    if (!q.trim()) return
    location.href = `/${q.trim()}`
  }

  const copy = id => navigator.clipboard.writeText(`${location.origin}/${id}`)

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-10 text-white font-sans bg-black">
      <h1 className="text-2xl font-bold m-0">Hackclub Emoji CDN</h1>
      <p className="text-gray-400 m-0 p-0">Do /name:size to get a scaled image</p>

      <form onSubmit={search} className="w-full max-w-md flex">
        <input
          className="flex-1 px-3 py-2 bg-gray-800 text-white outline-1 outline-gray-600 focus:outline-2 focus:outline-blue-400 rounded-l placeholder-gray-400"
          placeholder="Enter emoji name…"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <button className="bg-blue-500 px-4 rounded-r cursor-pointer hover:brightness-110">Go</button>
      </form>

      <div className="grid grid-cols-8 sm:grid-cols-24 md:grid-cols-32 gap-1">
        {items.map(e => (
          <div
            key={e.id}
            onClick={()=>window.open(`/${e.id}`, "_blank")}
            className="cursor-pointer rounded w-[40px] h-[40px] flex items-center justify-center hover:bg-white/10"
            title={`${e.id} (${e.count} uses)`}
          >
            <img
              src={`https://e.alimad.co/${e.id}`}
              alt={e.id}
              className="w-[24px] h-[24px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
