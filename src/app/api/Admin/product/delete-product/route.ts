import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) return NextResponse.json({ success: true, message: "É necessário o ID do Produto" });

      const deleteData = await Product.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Produto eliminado com sucesso!" });
      } else {
        return NextResponse.json({ success: false, message: "Falha ao eliminar o Produto. Por favor, tente novamente!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
