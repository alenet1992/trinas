import mongoose from 'mongoose';
import Product from './Product';

export interface IWeeklyMenu {
    _id?: string;
    weekIndex: number;
    startDate: Date;
    endDate: Date;
    menu: {
        [day: string]: Array<{
            _id: string;
            name: string;
            description?: string;
            category: {
                _id: string;
                name: string;
            };
        }>;
    };
    createdAt?: string;
    updatedAt?: string;
};

const WeeklyMenuSchema = new mongoose.Schema({
    weekIndex: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    menu: {
        type: Map,
        of: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }]
    }
}, { timestamps: true });

const WeeklyMenu = mongoose.models.WeeklyMenu || mongoose.model('WeeklyMenu', WeeklyMenuSchema);

export default WeeklyMenu;