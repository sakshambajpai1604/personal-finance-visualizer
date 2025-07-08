import connectToDatabase from '@/utils/db';
import Transaction from '@/models/Transaction';

export async function GET(req) {
  await connectToDatabase();
  const transactions = await Transaction.find({}).sort({ date: -1 });
  return Response.json(transactions);
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  const { amount, date, description } = body;

  if (!amount || !date || !description) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  const transaction = new Transaction({ amount, date, description });
  await transaction.save();

  return Response.json(transaction);
}