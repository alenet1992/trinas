

import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import ProductPrice from "@/model/ProductPrice";


export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) return NextResponse.json({ status: 400, success: false, message: 'Please provide product id.' });
    const productPrices = await ProductPrice.find({ product: productId });
    console.log(productPrices)
   // const productPrices = await ProductPrice.find({ product: productId }).populate('Quantity', 'name description')
    if (productPrices && productPrices.length > 0) {
      return NextResponse.json({ success: true, data: productPrices });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'No product prices found for this product.' });
    }

  } catch (error) {
    console.log('Error in getting product prices by product id:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
