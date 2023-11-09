import { ClientModel } from './../../../../../model/Client';
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Client from "@/model/Client";
import Joi from "joi";

const AddClientSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  location: Joi.string().required(),
  postalCode: Joi.string().required(),
  nif: Joi.number().required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {

      const data: ClientModel = await req.json();

      const { name, number, street, city, location, postalCode, nif } = data;

      const { error } = AddClientSchema.validate({ name, number, street, city, location, postalCode, nif });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Client.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Cliente added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the Cliente. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new Product:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
