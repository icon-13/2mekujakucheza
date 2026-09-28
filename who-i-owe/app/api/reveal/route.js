import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const people = (await get("people")) || [];
    const person = people.find((p) => p.id === id);

    if (!person || person.password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({
      name: person.name,
      amount: person.amount,
      message: person.message,
    });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}