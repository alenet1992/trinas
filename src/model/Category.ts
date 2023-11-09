import mongoose from 'mongoose';

export interface ICategory {
    _id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string;
    updatedAt: string;
};

const CategorySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
}, { timestamps: true });

const Category = mongoose.models.Categories || mongoose.model('Categories', CategorySchema);

export default Category;