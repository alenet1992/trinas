import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Quantity from "@/model/Quantity";
import Joi from "joi";


const AddQuantitySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated !== 'admin') {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

    const data = await req.json();
    const { name, description } = data;

    const { error } = AddQuantitySchema.validate({ name, description });

    if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    const saveData = await Quantity.create(data);

    if (saveData) {
      return NextResponse.json({ success: true, message: "New quantidade!" });
    } else {
      return NextResponse.json({ success: false, message: "Failed to add the Quantity. Please try again!" });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
