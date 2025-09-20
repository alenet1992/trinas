import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Joi from "joi";
import Product from "@/model/Product";





const AddProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.required()
})





export async function POST(req: any, res: any) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
  
    console.log('aqui');
    if (isAuthenticated === 'admin') {

      const formData = await req.formData();

      const name = formData.get('name');
      const description = formData.get('description');
      const categoryID = formData.get('categoryID');
      const quantJson = formData.get('quant');
      
      // Criar objeto de dados para validação e criação
      const data = {
        name,
        description,
        category: categoryID,
        quant: quantJson ? JSON.parse(quantJson) : []
      };

      console.log('formData processed', data);
      const { error } = AddProductSchema.validate({ name, description, category: categoryID });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"`]+/g, '') });

      const saveData = await Product.create(data);


      if (saveData) {
        return NextResponse.json({ success: true, message: "Product added successfully!", saveData });
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
