import mongoose from 'mongoose';

export interface ClientModel {
    _id?: string,
    name: string,
    contact: Number,
    address: string,
    note?: string,
    nif: string
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