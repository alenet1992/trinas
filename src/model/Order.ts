import mongoose from "mongoose";
import User from "./User";
import Product from "./Product";

// Schema para o contador de pedidos
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});


// Modelo para o contador (se não existir)
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            qty: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
            },

        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "Paypal" },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    orderName: { type: String },
    orderType: { type: String, enum: ['takeaway', 'delivery'], default: 'takeaway' },
    pickupTime: { type: Date },
}, { timestamps: true });

// Middleware pre-save para incrementar automaticamente o orderNumber
OrderSchema.pre('save', async function(next) {
    const doc = this;
    if (doc.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'orderNumber' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            doc.orderNumber = counter.seq;
            next();
        } catch (error) {
            // Corrigindo o tipo do erro para ser compatível com CallbackError
            return next(new Error(error instanceof Error ? error.message : 'Erro ao gerar número do pedido'));
        }
    } else {
        next();
    }
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;