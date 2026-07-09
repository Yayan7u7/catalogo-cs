import { NextRequest, NextResponse } from "next/server";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Se requiere una URL valida." },
        { status: 400 }
      );
    }

    await deleteFromR2(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando imagen de R2:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar la imagen." },
      { status: 500 }
    );
  }
}
