import { NextResponse } from "next/server";

import { AUTH_COOKIE, USER_COOKIE } from "@/lib/api";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son obligatorios." },
        { status: 400 },
      );
    }

    const session = await login(email, password);
    const response = NextResponse.json({ user: session.user });
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set(AUTH_COOKIE, session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    response.cookies.set(USER_COOKIE, JSON.stringify(session.user), {
      httpOnly: false,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      },
      { status: 401 },
    );
  }
}
