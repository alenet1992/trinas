import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import ProductPrice from "@/model/ProductPrice";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await connectDB();
  try {
    const getData = await ProductPrice.find({}).populate('product').populate('quantity');
    if (getData) {
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'No product prices found.' });
    }
  } catch (error) {
    console.log('Error in getting all product prices:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}