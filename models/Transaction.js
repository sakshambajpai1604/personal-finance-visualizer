import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Other'], // predefined categories
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);