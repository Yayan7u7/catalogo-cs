import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Redirigir/Reescribir las peticiones de /api/:path* hacia el backend de NestJS
  if (
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/assistant") &&
    !pathname.startsWith("/api/auth")
  ) {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:4000";
    const apiPath = pathname.replace(/^\/api/, "");
    const targetUrl = new URL(`${apiPath}${search}`, backendUrl);
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

// Configurar el matcher para interceptar únicamente las rutas de la API
export const config = {
  matcher: ["/api/:path*"],
};
