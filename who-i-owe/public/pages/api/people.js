import { get } from "@vercel/edge-config";

export default async function handler(req, res) {
  try {
    const people = (await get("people")) || [];
    const safeList = people.map((p) => ({ id: p.id, name: p.name }));
    res.status(200).json(safeList);
  } catch (err) {
    res.status(500).json({ error: "Could not load list" });
  }
}