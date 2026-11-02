import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import User from "@/model/User";
import Joi from "joi";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic'

const UpdateUserSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').required(),
  // A password é opcional: só é alterada se vier preenchida
  password: Joi.string().min(8).allow('', null).optional(),
});

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated !== 'admin') {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }

    const data = await req.json();
    const { _id, name, email, role, password } = data ?? {};

    const { error } = UpdateUserSchema.validate({ _id, name, email, role, password });
    if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    // Garantir que o email não fica duplicado com outro utilizador
    const duplicated = await User.findOne({ email, _id: { $ne: _id } });
    if (duplicated) return NextResponse.json({ success: false, message: "Já existe um utilizador com este email." });

    const update: Record<string, string> = { name, email, role };
    if (password) update.password = await hash(password, 12);

    const saveData = await User.findByIdAndUpdate(_id, update, { new: true });
    if (!saveData) return NextResponse.json({ success: false, message: "Utilizador não encontrado." });

    return NextResponse.json({ success: true, message: "Utilizador atualizado com sucesso!" });
  } catch (error) {
    console.log('Erro ao atualizar o utilizador:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
