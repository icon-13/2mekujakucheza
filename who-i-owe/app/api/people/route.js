import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const people = (await get("people")) || [];
    return NextResponse.json(people.map((p) => ({ id: p.id, name: p.name })));
  } catch (err) {
    return NextResponse.json({ error: "Could not load list" }, { status: 500 });
  }
}