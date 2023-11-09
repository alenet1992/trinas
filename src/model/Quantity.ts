import mongoose from 'mongoose';

export interface Quantity {
    _id?: String,
    name: String,
    description: String
};

const QuantitySchema = new mongoose.Schema({
    name: String,
    description: String
});

const Quantity = mongoose.models.Quantity || mongoose.model('Quantity', QuantitySchema);

export default Quantity;