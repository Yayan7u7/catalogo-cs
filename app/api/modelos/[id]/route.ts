import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Modelo from "@/models/Modelo";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const modelo = await Modelo.findById(id);

    if (!modelo) {
      return NextResponse.json(
        { error: "Modelo no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(modelo);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener la modelo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const modeloActualizada = await Modelo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!modeloActualizada) {
      return NextResponse.json(
        { error: "Modelo no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(modeloActualizada);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar la modelo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const modeloEliminada = await Modelo.findByIdAndDelete(id);

    if (!modeloEliminada) {
      return NextResponse.json(
        { error: "Modelo no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar la modelo" },
      { status: 500 }
    );
  }
}
