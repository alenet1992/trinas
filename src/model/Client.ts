import mongoose from 'mongoose';

export interface ClientModel {
    _id?: String,
    name: String,
    number: Number,
    street: String,
    city: String,
    location: String,
    postalCode: String,
    nif: String,
};

const ClientSchema = new mongoose.Schema({
    name: String,
    number: Number,
    street: String,
    city: String,
    location: String,
    postalCode: String,
    nif: String,
});

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

export default Client;