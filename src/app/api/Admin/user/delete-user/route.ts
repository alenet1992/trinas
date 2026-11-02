import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import User from "@/model/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export const dynamic = 'force-dynamic'

// Id do utilizador autenticado (vem no token emitido no login)
const currentUserId = (req: Request): string | null => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECREAT ?? 'default_secret_dumbScret') as JwtPayload;
    return decoded?.id ? String(decoded.id) : null;
  } catch {
    return null;
  }
};

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated !== 'admin') {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }

    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: "ID do utilizador é obrigatório." });

    if (currentUserId(req) === id) {
      return NextResponse.json({ success: false, message: "Não pode apagar a sua própria conta." });
    }

    const deleteData = await User.findByIdAndDelete(id);
    if (!deleteData) return NextResponse.json({ success: false, message: "Utilizador não encontrado." });

    return NextResponse.json({ success: true, message: "O utilizador foi eliminado da base de dados!" });
  } catch (error) {
    console.log('Erro ao eliminar o utilizador:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
