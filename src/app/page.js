"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };

  const fetchBudgets = async () => {
    const res = await fetch('/api/budgets');
    const data = await res.json();
    setBudgets(data);
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

  // New category data processing
  const categoryData = {};
  transactions.forEach(txn => {
    categoryData[txn.category] = (categoryData[txn.category] || 0) + txn.amount;
  });
  const pieData = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: categoryData[cat]
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  // Calculate total expenses this month
  const thisMonth = new Date().getMonth();
  const totalThisMonth = transactions
    .filter(txn => new Date(txn.date).getMonth() === thisMonth)
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0,5);

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

      {/* Dashboard Summary */}
      <h2 className="text-xl font-bold mt-8 mb-4">Dashboard Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm">Total Expenses This Month</p>
          <p className="text-xl font-bold">₹{totalThisMonth}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm mb-2">Category Breakdown</p>
          <PieChart width={200} height={200}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm mb-2">Recent Transactions</p>
          <ul className="space-y-1">
            {recentTransactions.map(txn => (
              <li key={txn._id} className="text-sm">₹{txn.amount} - {txn.category}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}