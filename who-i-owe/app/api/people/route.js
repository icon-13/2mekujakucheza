import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const people = JSON.parse(process.env.PEOPLE || "[]");
    return NextResponse.json(people.map((p) => ({ id: p.id, name: p.name })));
  } catch (err) {
    console.error("people route error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}