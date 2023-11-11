import { ClientModel } from './../../../../../model/Client';
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Client from "@/model/Client";
import Joi from "joi";

const AddClientSchema = Joi.object({
  name: Joi.string().required(),
  contact: Joi.number().required(),
  address: Joi.string().required()
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated === 'admin' || isAuthenticated === 'user') {

      const data: ClientModel = await req.json();

      const { name, contact, address, note, nif } = data;

      const { error } = AddClientSchema.validate({ name, contact, address });

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
