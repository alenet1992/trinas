import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import AuthCheck from "@/middleware/AuthCheck";
import mongoose from "mongoose";


export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ status: 400, success: false, message: 'ID do pedido não fornecido' });
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      // Validar se o ID é um ObjectId válido do MongoDB
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ status: 400, success: false, message: 'ID do pedido inválido' });
      }
      
      const getData = await Order.findById(id).populate("orderItems.product").populate("orderItems.product.category");
      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 404, success: false, message: 'Pedido não encontrado' });
      }

    } else {
      return NextResponse.json({ status: 401, success: false, message: "Não autorizado. Por favor, faça login!" });
    }


  } catch (error) {
    console.log('Erro ao obter detalhes do pedido:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Ocorreu um erro. Por favor, tente novamente!' });
  }
}
