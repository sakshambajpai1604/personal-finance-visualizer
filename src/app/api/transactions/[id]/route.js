import connectToDatabase from '@/utils/db';
import Transaction from '@/models/Transaction';

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const body = await req.json();

  const { amount, date, description } = body;

  if (!amount || !date || !description) {
    return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { amount, date, description },
    { new: true }
  );

  return Response.json(updatedTransaction);
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  await Transaction.findByIdAndDelete(id);

  return Response.json({ message: 'Transaction deleted' });
}