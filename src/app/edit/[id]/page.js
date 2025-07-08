"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditTransaction() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ amount: '', date: '', description: '' });
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
          description: txn.description
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
    if (!form.amount || !form.date || !form.description) {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <Input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <Input type="date" name="date" value={form.date} onChange={handleChange} />
        <Input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}