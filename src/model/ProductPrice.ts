import mongoose from "mongoose";
import Product from "./Product";
import Quantity from './Quantity';

const ProductPriceSchema = new mongoose.Schema({
    value: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quantity',
        required: true
    },
}, { timestamps: true });

export default mongoose.models.ProductPrice || mongoose.model('ProductPrice', ProductPriceSchema);

