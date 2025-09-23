import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import WeeklyMenu from "@/model/WeeklyMenu";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const weekIndex = searchParams.get('weekIndex');

    if (!weekIndex) {
      // If no weekIndex is provided, return all weekly menus
      const getData = await WeeklyMenu.find({}).populate({
        path: 'menu.$*.id',
        model: 'Products',
        select: 'name description category prices',
        populate: {
          path: 'category',
          model: 'Categories',
          select: 'name'
        }
      });
      if (getData && getData.length > 0) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No weekly menus found.' });
      }
    } else {
      // If weekIndex is provided, return the specific weekly menu
      const getData = await WeeklyMenu.findOne({ weekIndex: parseInt(weekIndex)}).populate({
        path: 'menu.$*._id',
        model: 'Products',
        select: 'name description category prices',
        populate: {
          path: 'category',
          model: 'Categories',
          select: 'name'
        }
      });
      
      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No weekly menu found for the specified week.' });
      }
    }
  } catch (error) {
    console.log('Error in getting weekly menu:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}