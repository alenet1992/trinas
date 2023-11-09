import mongoose from "mongoose";
import Category from "./Category";

export interface IProduct {
    _id?: string,
    name: string,
    description: string;
    productImage: string;
    category: {
        _id: string;
        name: string;
    },
    createdAt: string;
    updatedAt: string;
};

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    productImage: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
}, { timestamps: true });

const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);

export default Product;

