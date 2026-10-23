import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import User from "@/model/User";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated === 'admin') {
      // Mesma coleção usada pelo login; nunca devolver a password
      const getData = await User.find({}).select('-password').sort({ name: 1 });
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }
  } catch (error) {
    console.log('Erro ao obter os utilizadores:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
