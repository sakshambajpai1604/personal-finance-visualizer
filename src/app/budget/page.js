"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BudgetPage() {
  const [form, setForm] = useState({ category: 'Food', month: '', amount: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.month || !form.amount) {
      setMessage('All fields are required');
      setIsSuccess(false);
      return;
    }

    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });

    if (res.ok) {
      setMessage('✅ Budget set successfully');
      setIsSuccess(true);
      setForm({ category: 'Food', month: '', amount: '' });
    } else {
      const data = await res.json();
      setMessage(data.message || 'Error setting budget');
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Set Monthly Budget</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <p className={`${isSuccess ? "text-green-600" : "text-red-500"} text-center`}>
              {message}
            </p>
          )}

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

          <div>
            <Label htmlFor="month">Month</Label>
            <Input
              type="text"
              name="month"
              id="month"
              placeholder="e.g., Jul 2025"
              value={form.month}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              type="number"
              name="amount"
              id="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">Set Budget</Button>
        </form>
      </div>
    </div>
  );
}