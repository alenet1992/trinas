import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import WeeklyMenu from "@/model/WeeklyMenu";
import Joi from "joi";

const saveWeeklyMenuSchema = Joi.object({
    weekIndex: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    menu: Joi.object().required()
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        await connectDB();
        const isAuthenticated = await AuthCheck(req);

        if (isAuthenticated === 'admin') {
            const data = await req.json();
            const { weekIndex, startDate, endDate, menu } = data;

            const { error } = saveWeeklyMenuSchema.validate({ weekIndex, startDate, endDate, menu });

            if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"+]/g, '') });

            // Check if a menu for this week already exists
            const existingMenu = await WeeklyMenu.findOne({ weekIndex });

            let saveData;
            if (existingMenu) {
                // Update existing menu
                saveData = await WeeklyMenu.findByIdAndUpdate(
                    existingMenu._id,
                    { weekIndex, startDate, endDate, menu },
                    { new: true }
                );
            } else {
                // Create new menu
                saveData = await WeeklyMenu.create(data);
            }

            if (saveData) {
                return NextResponse.json({ success: true, message: "Weekly menu saved successfully!", data: saveData });
            } else {
                return NextResponse.json({ success: false, message: "Failed to save weekly menu. Please try again!" });
            }
        } else {
            return NextResponse.json({ success: false, message: "You are not authorized." });
        }
    } catch (error) {
        console.log('Error in saving weekly menu:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
    }
}