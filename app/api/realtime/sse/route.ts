import { NextRequest } from "next/server";
import { getAccessToken } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return new Response("No autorizado", { status: 401 });
  }

  const apiBaseUrl = getApiBaseUrl();
  const backendUrl = `${apiBaseUrl}/realtime/sse/jefes?token=${encodeURIComponent(token)}`;

  try {
    const response = await fetch(backendUrl, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response(`Error del backend: ${response.status}`, {
        status: response.status,
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Error en proxy SSE:", error);
    return new Response("Error interno del servidor proxy SSE", { status: 500 });
  }
}
