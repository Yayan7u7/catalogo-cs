"use server";

import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

const dbName = process.env.MONGO_DB_NAME || "RVCS-database";

export async function getLiquidationsRecords(startDate: string, endDate: string) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const records = await db
      .collection("registros")
      .find({
        fecha: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ fecha: -1 })
      .toArray();

    return records.map((r) => ({
      ...r,
      _id: r._id.toString(), // Serialize ObjectId
    }));
  } catch (error) {
    console.error("Error fetching liquidations records:", error);
    return [];
  }
}

export async function getEmployeesAndUsers() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const users = await db
      .collection("usuarios")
      .find({})
      .project({
        passwordHash: 0,
        telegramVerificationCode: 0,
        telegramVerificationExpiresAt: 0,
      })
      .toArray();

    return users.map((u) => ({
      ...u,
      _id: u._id.toString(),
      id: u.id || u._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getDeudas(uid_empleada?: string) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const query = uid_empleada ? { uid_empleada } : {};
    const deudas = await db
      .collection("deudas")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return deudas.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching deudas:", error);
    return [];
  }
}

export async function updateRecord(recordId: string, data: any) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data; // Prevent modifying _id
    const { ObjectId } = await import("mongodb");

    await db.collection("registros").updateOne(
      { _id: new ObjectId(recordId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    revalidatePath("/admin/liquidations");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating record:", error);
    return { success: false, error: error.message };
  }
}

// Deudas actions
export async function createDeuda(data: any) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const insertData = {
      ...data,
      pagos: [],
      estado: "pendiente",
      createdAt: new Date().toISOString(),
    };
    await db.collection("deudas").insertOne(insertData);
    revalidatePath("/admin/liquidations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDeuda(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const { ObjectId } = await import("mongodb");
    await db.collection("deudas").deleteOne({ _id: new ObjectId(id) });
    revalidatePath("/admin/liquidations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addPagoToDeuda(deudaId: string, pagoData: any) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const { ObjectId } = await import("mongodb");
    const id = new ObjectId(); // generates unique ID for payment

    const nuevoPago = {
      ...pagoData,
      id: id.toString(),
      fecha: new Date().toISOString(),
    };

    // Primero añadimos el pago
    await db
      .collection("deudas")
      .updateOne(
        { _id: new ObjectId(deudaId) },
        { $push: { pagos: nuevoPago } as any },
      );

    // Luego verificamos el estado
    const deuda = await db
      .collection("deudas")
      .findOne({ _id: new ObjectId(deudaId) });
    if (deuda) {
      const totalPagado = (deuda.pagos || []).reduce(
        (acc: number, p: any) => acc + (Number(p.monto) || 0),
        0,
      );
      if (totalPagado >= Number(deuda.monto_total)) {
        await db
          .collection("deudas")
          .updateOne(
            { _id: new ObjectId(deudaId) },
            { $set: { estado: "pagada" } },
          );
      } else {
        await db
          .collection("deudas")
          .updateOne(
            { _id: new ObjectId(deudaId) },
            { $set: { estado: "pendiente" } },
          );
      }
    }

    revalidatePath("/admin/liquidations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePagoFromDeuda(deudaId: string, pagoId: string) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const { ObjectId } = await import("mongodb");

    await db
      .collection("deudas")
      .updateOne(
        { _id: new ObjectId(deudaId) },
        { $pull: { pagos: { id: pagoId } } as any },
      );

    // Recalcular estado
    const deuda = await db
      .collection("deudas")
      .findOne({ _id: new ObjectId(deudaId) });
    if (deuda) {
      const totalPagado = (deuda.pagos || []).reduce(
        (acc: number, p: any) => acc + (Number(p.monto) || 0),
        0,
      );
      if (totalPagado < Number(deuda.monto_total)) {
        await db
          .collection("deudas")
          .updateOne(
            { _id: new ObjectId(deudaId) },
            { $set: { estado: "pendiente" } },
          );
      }
    }

    revalidatePath("/admin/liquidations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
