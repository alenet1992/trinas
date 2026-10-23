import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import SiteContent from "@/model/SiteContent";
import { mergeSiteContent } from "@/utils/siteContentDefaults";

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      // Guarda apenas os campos conhecidos
      const content = mergeSiteContent(data);
      const saveData = await SiteContent.findOneAndUpdate(
        { key: 'home' },
        { key: 'home', content },
        { new: true, upsert: true }
      );

      if (saveData) {
        return NextResponse.json({ success: true, message: "Conteúdo do site atualizado com sucesso!", data: content });
      } else {
        return NextResponse.json({ success: false, message: "Falha ao atualizar o site. Por favor, tente novamente!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Não está autorizado." });
    }
  } catch (error) {
    console.log('Erro ao atualizar o conteúdo do site:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
