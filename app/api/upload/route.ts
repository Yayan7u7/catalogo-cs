import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporciono ningun archivo." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen." },
        { status: 400 }
      );
    }

    // Limitar a 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no debe superar los 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToR2(buffer, file.name, file.type);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error subiendo imagen a R2:", error);
    return NextResponse.json(
      { error: "Error interno al subir la imagen." },
      { status: 500 }
    );
  }
}
