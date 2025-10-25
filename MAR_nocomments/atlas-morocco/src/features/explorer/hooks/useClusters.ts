import { useEffect, useMemo, useState } from "react"
import supercluster from "supercluster"
import type { Feature, FeatureCollection, Point } from "geojson"

export default function useClusters(zoom: number, bounds: [number, number, number, number] | undefined, categories: string[]) {
  const [data, setData] = useState<FeatureCollection<Point>>({ type: "FeatureCollection", features: [] })

  useEffect(() => {
    fetch("/data/places.json").then(r => r.json()).then((geo: FeatureCollection<Point>) => setData(geo))
  }, [])

  const clusters = useMemo(() => {
    if (!data.features.length) return [] as Feature<Point>[]
    const filtered = categories.length
      ? data.features.filter(f => (f.properties as any)?.category && categories.includes((f.properties as any).category))
      : data.features
    const index = new supercluster({ radius: 60, maxZoom: 16 })
    index.load(filtered as any)
    const c = index.getClusters(bounds ?? [-180, -85, 180, 85], Math.round(zoom))
    return c as Feature<Point>[]
  }, [data, zoom, bounds, categories])

  return clusters
}