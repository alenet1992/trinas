import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  { name , _id  , description  } = data
      const saveData = await Category.findOneAndUpdate({_id} , { name , description}  , { new: true });

      if (saveData) {
        return NextResponse.json({ success: true, message: "Categoria atualizada com sucesso!" });
      } else {
        return NextResponse.json({ success: false, message: "Falha ao atualizar a categoria. Por favor, tente novamente!" });
      }

    } else {
      return NextResponse.json({ success: false, message: "Você não está autorizado." });
    }

  } catch (error) {

    console.log('Erro ao atualizar uma nova categoria:', error);
    return NextResponse.json({ success: false, message: 'Algo deu errado. Por favor, tente novamente!' });

  }
}
