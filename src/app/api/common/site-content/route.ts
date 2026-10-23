import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import SiteContent from "@/model/SiteContent";
import { mergeSiteContent } from "@/utils/siteContentDefaults";

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB();
    const saved = await SiteContent.findOne({ key: 'home' }).lean() as { content?: any } | null;
    return NextResponse.json({ success: true, data: mergeSiteContent(saved?.content) });
  } catch (error) {
    console.log('Erro ao obter o conteúdo do site:', error);
    // Sem base de dados o site continua a mostrar o conteúdo por defeito
    return NextResponse.json({ success: true, data: mergeSiteContent(null) });
  }
}
