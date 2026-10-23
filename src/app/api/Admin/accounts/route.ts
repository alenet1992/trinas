import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import CompanyAccount from "@/model/CompanyAccount";
import { decrypt, encrypt } from "@/utils/encryption";

export const dynamic = 'force-dynamic'

const notAuthorized = () => NextResponse.json({ success: false, message: "Não está autorizado." }, { status: 401 });

const pickFields = (data: any) => ({
  service: String(data?.service ?? '').trim(),
  email: String(data?.email ?? '').trim(),
  url: String(data?.url ?? '').trim(),
  note: String(data?.note ?? '').trim(),
});

// GET            -> lista de contas (sem passwords)
// GET ?id=xxx    -> password desencriptada de uma conta
export async function GET(req: Request) {
  try {
    await connectDB();
    if (await AuthCheck(req) !== 'admin') return notAuthorized();

    const id = new URL(req.url).searchParams.get('id');
    if (id) {
      const account = await CompanyAccount.findById(id);
      if (!account) return NextResponse.json({ success: false, message: "Conta não encontrada." });
      return NextResponse.json({ success: true, data: { password: decrypt(account.password) } });
    }

    const accounts = await CompanyAccount.find({}).select('-password').sort({ service: 1 });
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    console.log('Erro ao obter contas:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    if (await AuthCheck(req) !== 'admin') return notAuthorized();

    const data = await req.json();
    const fields = pickFields(data);
    if (!fields.service || !fields.email || !data?.password) {
      return NextResponse.json({ success: false, message: "Serviço, email e password são obrigatórios." });
    }

    await CompanyAccount.create({ ...fields, password: encrypt(String(data.password)) });
    return NextResponse.json({ success: true, message: "Conta adicionada." });
  } catch (error) {
    console.log('Erro ao adicionar conta:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}

// A password só é alterada se vier preenchida
export async function PUT(req: Request) {
  try {
    await connectDB();
    if (await AuthCheck(req) !== 'admin') return notAuthorized();

    const data = await req.json();
    const fields = pickFields(data);
    if (!data?._id || !fields.service || !fields.email) {
      return NextResponse.json({ success: false, message: "Serviço e email são obrigatórios." });
    }

    const update: Record<string, string> = { ...fields };
    if (data.password) update.password = encrypt(String(data.password));

    const saved = await CompanyAccount.findByIdAndUpdate(data._id, update);
    if (!saved) return NextResponse.json({ success: false, message: "Conta não encontrada." });
    return NextResponse.json({ success: true, message: "Conta atualizada." });
  } catch (error) {
    console.log('Erro ao atualizar conta:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    if (await AuthCheck(req) !== 'admin') return notAuthorized();

    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: "ID da conta é obrigatório." });

    const deleted = await CompanyAccount.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: "Conta não encontrada." });
    return NextResponse.json({ success: true, message: "Conta eliminada." });
  } catch (error) {
    console.log('Erro ao eliminar conta:', error);
    return NextResponse.json({ success: false, message: 'Algo correu mal. Por favor, tente novamente!' });
  }
}
