import connectDB from "@/DB/connectDB";

import { NextResponse } from "next/server";
import Client from "@/model/Client";


export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const getData = await Client.find({}).sort({ name: 1 });
    if (getData) {
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'No products found.' });
    }

  } catch (error) {
    console.log('Error in getting all products:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
