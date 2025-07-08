import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Other'],
  },
  month: {
    type: String,
    required: true, // e.g., "Jul 2025"
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);