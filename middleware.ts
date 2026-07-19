import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "cs_admin_session";

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Redirigir/Reescribir las peticiones de /api/:path* hacia el backend de NestJS
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/assistant") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/realtime")
  ) {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:4000";
    const apiPath = pathname.replace(/^\/api/, "");
    const targetUrl = new URL(`${apiPath}${search}`, backendUrl);
    return NextResponse.rewrite(targetUrl);
  }

  // Protección de rutas de administración
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isValid = token ? await verifyToken(token) : null;

    if (isValid && (isValid.user as { rol?: string } | undefined)?.rol === "admin") {
      // Si ya está autenticado y está en la raíz /admin, redirigir a /admin/modelos
      if (pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/modelos", request.url));
      }
    } else {
      // Si no está autenticado y está en una subruta de /admin, redirigir a /admin
      if (pathname !== "/admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }


  if (pathname.startsWith("/jefe")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifyToken(token) : null;
    const role = (session?.user as { rol?: string } | undefined)?.rol;

    if (!session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role !== "jefe") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Configurar el matcher para interceptar la API y el panel de administración
export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/jefe/:path*"],
};
