import { NextResponse } from "next/server";

function parse(name) {
  try {
    const v = JSON.parse(process.env[name] || "[]");
    return Array.isArray(v) ? v : v.people || v.payments || [];
  } catch {
    return [];
  }
}

export async function POST(req) {
  try {
    const { id, password } = await req.json();

    if (!id || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const person = parse("PEOPLE").find((p) => p.id === id);

    if (!person || person.password !== password) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({
      name: person.name,
      amount: person.amount,
      message: person.message,
      payments: person.amount > 0 ? parse("PAYMENTS") : [],
    });
  } catch (err) {
    console.error("reveal route error:", err.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}