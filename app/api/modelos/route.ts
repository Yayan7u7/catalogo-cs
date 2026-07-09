import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Modelo from "@/models/Modelo";
import { isAuthenticated } from "@/lib/auth"; // Crearemos esto mas adelante

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const onlyAvailable = searchParams.get("onlyAvailable") === "true";

    const query = onlyAvailable ? { disponible: true } : {};
    
    const modelos = await Modelo.find(query);

    // Aleatorizar el arreglo de modelos de forma segura
    const shuffled = modelos.sort(() => 0.5 - Math.random());

    return NextResponse.json(shuffled);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener los modelos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Proteger ruta POST (crear modelo)
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const nuevaModelo = await Modelo.create(body);

    return NextResponse.json(nuevaModelo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear la modelo" },
      { status: 500 }
    );
  }
}
