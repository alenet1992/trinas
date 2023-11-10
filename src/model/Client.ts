import mongoose from 'mongoose';

export interface ClientModel {
    _id?: String,
    name: String,
    contact: Number,
    address: String,
    note?: String,
    nif: String
};

const ClientSchema = new mongoose.Schema({
    name: String,
    contact: Number,
    address: String,
    note: String,
    nif: String,
});

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

export default Client;