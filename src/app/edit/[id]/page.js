"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditTransaction() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ amount: '', date: '', description: '', category: 'Food' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      const res = await fetch(`/api/transactions`);
      const data = await res.json();
      const txn = data.find(t => t._id === id);
      if (txn) {
        setForm({
          amount: txn.amount,
          date: txn.date.slice(0,10),
          description: txn.description,
          category: txn.category || 'Food',
        });
      }
      setLoading(false);
    };
    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description || !form.category) {
      setError('All fields are required');
      return;
    }

    const res = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'Error updating transaction');
    }
  };

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Transaction</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" name="amount" id="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" name="date" id="date" value={form.date} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input type="text" name="description" id="description" placeholder="Description" value={form.description} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {['Food', 'Travel', 'Shopping', 'Bills', 'Other'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="submit" className="w-full">Update</Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => router.push('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}