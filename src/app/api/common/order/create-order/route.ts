import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import Joi from "joi";

const createOrderSchema = Joi.object({
    user: Joi.string().required(),
    orderItems: Joi.array().items(
        Joi.object({
            qty: Joi.number().required(),
            product: Joi.string().required()
        })
    ).required(),
    shippingAddress: Joi.object({
        fullName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.number().required(),
        country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().required(),
    itemsPrice: Joi.number().required(),
    shippingPrice: Joi.number().required(),
    taxPrice: Joi.number().required(),
    totalPrice: Joi.number().required(),
    orderName: Joi.string(),
    orderType: Joi.string().valid('takeaway', 'delivery'),
    pickupTime: Joi.string().optional().allow('').allow(null),
    status: Joi.string().valid('new', 'in_progress', 'delivered'),
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        await connectDB();
        const isAuthenticated = await AuthCheck(req);

        if (isAuthenticated) {
            const data = await req.json();
     
     
            const { error } = createOrderSchema.validate(data);

            if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });


            const saveData = await Order.create(data);
            if (saveData) {
  
                return NextResponse.json({ success: true, message: "Encomenda criada com sucesso! Os produtos estão a caminho." });
            } else {
                return NextResponse.json({ success: false, message: "Falha ao criar a encomenda. Por favor, tente novamente!" });
            }
        } else {
            return NextResponse.json({ success: false, message: "Você não está autorizado. Por favor, faça login!" });
        }
    } catch (error) {
        console.log('Erro ao criar encomenda:', error);
        return NextResponse.json({ success: false, message: 'Algo deu errado. Por favor, tente novamente!' });
    }
}
