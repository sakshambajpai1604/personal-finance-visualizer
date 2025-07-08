"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <h1 className="text-2xl font-bold mb-4 text-center">Add Transaction</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              name="amount"
              id="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              name="date"
              id="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="submit" className="w-full">Add Transaction</Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}