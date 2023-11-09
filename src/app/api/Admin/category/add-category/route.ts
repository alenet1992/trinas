import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";
import Joi from "joi";


const AddCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const { name, description, image } = data;

      const { error } = AddCategorySchema.validate({ name, description, image });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Category.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Tipo de prato adicionado!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the category. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new category:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
