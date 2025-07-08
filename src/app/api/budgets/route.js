import connectToDatabase from '@/utils/db';
import Budget from '@/models/Budget';

export async function GET(req) {
  await connectToDatabase();
  const budgets = await Budget.find({});
  return Response.json(budgets);
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();
  const { category, month, amount } = body;

  if (!category || !month || !amount) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  // Upsert budget for category and month
  const budget = await Budget.findOneAndUpdate(
    { category, month },
    { amount },
    { upsert: true, new: true }
  );

  return Response.json(budget);
}