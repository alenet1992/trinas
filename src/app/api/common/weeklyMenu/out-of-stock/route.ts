import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import WeeklyMenu from "@/model/WeeklyMenu";
import { getCurrentDayOfWeek } from '@/Services/common/weeklyMenu';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const weekIndex = searchParams.get('weekIndex');
    const currentDay = getCurrentDayOfWeek();

    if (!productId || !weekIndex) {
      return NextResponse.json({ 
        status: 400, 
        success: false, 
        message: 'Product ID and Week Index are required.' 
      });
    }

    // Encontrar o menu semanal específico que contém o produto
    const weeklyMenu = await WeeklyMenu.findOne({
      weekIndex: parseInt(weekIndex)
    });

    const updated =  weeklyMenu.menu.get(currentDay).map((element: any) => {
      if(element._id.toString() === productId) {
        element.outOfStock = true;
      }
      return element;
    });
    
    weeklyMenu.menu.set(currentDay, updated);

    await weeklyMenu.save();

    return NextResponse.json({
      success: true,
      message: 'Product marked as out of stock in the weekly menu.'
    });

  } catch (error) {
    console.log('Error in updating product stock status:', error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: 'Something went wrong. Please try again!'
    });
  }
}