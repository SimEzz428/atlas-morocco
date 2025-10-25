"use client"
import { motion } from "framer-motion"

const categories = [
  { id: "food", label: "Food" },
  { id: "handicrafts", label: "Handicrafts" },
  { id: "architecture", label: "Architecture" },
  { id: "nature", label: "Nature" },
  { id: "surf", label: "Surf" }
]

export default function Filters({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-black/10 dark:border-white/10 p-4 space-y-3 bg-white/40 dark:bg-black/30 backdrop-blur-md"
    >
      <h2 className="font-semibold text-lg">Filters</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              selected.includes(c.id)
                ? "bg-brand.red text-white"
                : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
            }`}
          >
            {c.label}
          </button>
        ))}
        <button
          onClick={() => selected.forEach(s => onToggle(s))}
          className="px-3 py-1.5 rounded-full text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
        >
          Clear
        </button>
      </div>
    </motion.div>
  )
}