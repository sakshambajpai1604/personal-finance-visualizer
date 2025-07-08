"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BudgetPage() {
  const [form, setForm] = useState({ category: 'Food', month: '', amount: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.month || !form.amount) {
      setMessage('All fields are required');
      return;
    }

    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });

    if (res.ok) {
      setMessage('Budget set successfully');
      setForm({ category: 'Food', month: '', amount: '' });
    } else {
      const data = await res.json();
      setMessage(data.message || 'Error setting budget');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Monthly Budget</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <p className="text-red-500">{message}</p>}
        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded">
          {['Food', 'Travel', 'Shopping', 'Bills', 'Other'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <Input type="text" name="month" placeholder="Month (e.g., Jul 2025)" value={form.month} onChange={handleChange} />
        <Input type="number" name="amount" placeholder="Budget Amount" value={form.amount} onChange={handleChange} />
        <Button type="submit">Set Budget</Button>
      </form>
    </div>
  );
}