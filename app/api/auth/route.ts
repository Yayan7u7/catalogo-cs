import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Credenciales de administrador no configuradas en el servidor." },
        { status: 500 }
      );
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      await createSessionCookie(email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
