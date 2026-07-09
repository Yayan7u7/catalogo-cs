import mongoose, { Schema, Document } from "mongoose";

export interface IModelo extends Document {
  nombre: string;
  descripcion: string;
  fotoPrincipal: string;
  fotos: string[];
  linkX: string;
  contactLink: string;
  contactLabel: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ModeloSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, default: "" },
    fotoPrincipal: { type: String, required: true },
    fotos: { type: [String], default: [] },
    linkX: { type: String, default: "" },
    contactLink: { type: String, default: "" },
    contactLabel: { type: String, default: "Contacto" },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Formateamos la respuesta del JSON para reemplazar _id por una representacion en string simple
// y estandarizar la salida al formato que usa nuestra app
ModeloSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret._id = ret._id.toString();
    return ret;
  },
});

export default mongoose.models.Modelo || mongoose.model<IModelo>("Modelo", ModeloSchema);
