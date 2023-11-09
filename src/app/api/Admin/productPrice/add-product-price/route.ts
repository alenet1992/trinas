import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import ProductPrice from "@/model/ProductPrice";

import Joi from "joi";
import { NextResponse } from "next/server";

const AddProductSchema = Joi.object({
  value: Joi.required(),
  product: Joi.string().required(),
  quantity: Joi.required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {

      const data = await req.json();

      const { value, product, quantity } = data;

      console.log(value, data);

      const { error } = AddProductSchema.validate({ value, product, quantity });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await ProductPrice.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Product added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the Product. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new Product:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
