"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };

  const deleteTransaction = async (id) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  // Prepare data for Monthly Expenses Bar Chart
  const monthlyData = {};
  transactions.forEach(txn => {
    const month = new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyData[month] = (monthlyData[month] || 0) + txn.amount;
  });
  const chartData = Object.keys(monthlyData).map(month => ({
    month,
    amount: monthlyData[month]
  }));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Visualizer</h1>

      <div className="mb-4">
        <Link href="/add">
          <Button>Add Transaction</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map(txn => (
            <li key={txn._id} className="border rounded p-2 flex justify-between items-center">
              <div>
                <p className="font-medium">₹{txn.amount}</p>
                <p className="text-sm">{new Date(txn.date).toDateString()}</p>
                <p className="text-sm">{txn.description}</p>
              </div>
              <div className="space-x-2">
                <Link href={`/edit/${txn._id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button variant="destructive" onClick={() => deleteTransaction(txn._id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}