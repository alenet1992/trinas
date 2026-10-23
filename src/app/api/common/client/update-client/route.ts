import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Client, { ClientModel } from "@/model/Client";
import Joi from "joi";

const UpdateClientSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  contact: Joi.number().required(),
  address: Joi.string().required()
})

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated === 'admin' || isAuthenticated === 'user') {

      const data: ClientModel = await req.json();

      const { _id, name, contact, address, note, nif } = data;

      const { error } = UpdateClientSchema.validate({ _id, name, contact, address });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Client.findByIdAndUpdate(_id, { name, contact, address, note, nif }, { new: true });

      if (saveData) {
        return NextResponse.json({ success: true, message: "Cliente atualizado com sucesso!" });
      } else {
        return NextResponse.json({ success: false, message: "Falha ao atualizar o Cliente. Por favor, tente novamente!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }
  } catch (error) {
    console.log('Erro ao atualizar o cliente:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
