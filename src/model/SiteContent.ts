import mongoose from 'mongoose';

// Um único documento (key: "home") com o conteúdo editável do site público
const SiteContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, minimize: false });

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

export default SiteContent;
