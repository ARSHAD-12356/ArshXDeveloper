import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

export const runtime = "nodejs";

// Best-effort in-memory rate limit (per server instance). Swap for Redis/Upstash at scale.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot filled: pretend success so bots learn nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const name = body.name!.trim();
  const email = body.email!.trim();
  const message = body.message!.trim();

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    // No provider configured: log so submissions are not silently lost in development.
    console.info("[contact] New message (configure RESEND_API_KEY + CONTACT_TO_EMAIL to deliver by email)", {
      name,
      email,
      projectType: body.projectType,
      budget: body.budget,
      length: message.length,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New portfolio enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nProject Type: ${body.projectType || "Not specified"}\nBudget: ${body.budget || "Not specified"}\n\n${message}`,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Delivery failed", err);
    return NextResponse.json({ ok: false, error: "Could not send right now. Please email me directly." }, { status: 502 });
  }
}