import { ClientModel } from './../../../../../model/Client';
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Client from "@/model/Client";
import Joi from "joi";

const AddClientSchema = Joi.object({
  name: Joi.string().required(),
  contact: Joi.number().required(),
  address: Joi.string().required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated === 'admin' || isAuthenticated === 'user') {

      const data: ClientModel = await req.json();

      const { name, contact, address } = data;

      const { error } = AddClientSchema.validate({ name, contact, address });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Client.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Cliente adicionado com sucesso!" });
      } else {
        return NextResponse.json({ success: false, message: "Falha ao adicionar o Cliente. Por favor, tente novamente!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }
  } catch (error) {
    console.log('Erro ao adicionar um novo cliente:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
