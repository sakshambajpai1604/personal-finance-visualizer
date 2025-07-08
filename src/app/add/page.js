"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddTransaction() {
  const router = useRouter();
  const [form, setForm] = useState({ amount: '', date: '', description: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date || !form.description) {
      setError('All fields are required');
      return;
    }

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message || 'Error adding transaction');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <Input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <Input type="date" name="date" value={form.date} onChange={handleChange} />
        <Input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}