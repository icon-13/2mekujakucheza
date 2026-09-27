import { get } from "@vercel/edge-config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, password } = req.body || {};
  if (!id || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const people = (await get("people")) || [];
    const person = people.find((p) => p.id === id);

    if (!person || person.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    return res.status(200).json({
      name: person.name,
      amount: person.amount,
      message: person.message,
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}