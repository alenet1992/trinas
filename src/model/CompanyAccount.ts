import mongoose from 'mongoose';

export interface CompanyAccountModel {
    _id?: string,
    service: string,
    email: string,
    password?: string,
    url?: string,
    note?: string,
    updatedAt?: string,
};

// A password é guardada encriptada (ver utils/encryption)
const CompanyAccountSchema = new mongoose.Schema({
    service: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    url: String,
    note: String,
}, { timestamps: true });

const CompanyAccount = mongoose.models.CompanyAccount || mongoose.model('CompanyAccount', CompanyAccountSchema);

export default CompanyAccount;
