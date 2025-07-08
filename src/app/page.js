"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Monthly expenses bar chart data
  const monthlyData = {};
  transactions.forEach(txn => {
    const month = new Date(txn.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyData[month] = (monthlyData[month] || 0) + txn.amount;
  });
  const chartData = Object.keys(monthlyData).map(month => ({
    month,
    amount: monthlyData[month]
  }));

  // Category data for pie chart
  const categoryData = {};
  transactions.forEach(txn => {
    categoryData[txn.category] = (categoryData[txn.category] || 0) + txn.amount;
  });
  const pieData = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: categoryData[cat]
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  // Total expenses this month
  const thisMonth = new Date().getMonth();
  const totalThisMonth = transactions
    .filter(txn => new Date(txn.date).getMonth() === thisMonth)
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Budget vs actual data
  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

  const budgetMap = {};
  budgets.forEach(b => {
    if (b.month === currentMonth) {
      budgetMap[b.category] = b.amount;
    }
  });

  const spentMap = {};
  transactions.forEach(t => {
    const txnMonth = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (txnMonth === currentMonth) {
      spentMap[t.category] = (spentMap[t.category] || 0) + t.amount;
    }
  });

  const budgetVsActualData = Object.keys(budgetMap).map(cat => ({
    category: cat,
    budget: budgetMap[cat],
    spent: spentMap[cat] || 0
  }));

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">💰 Personal Finance Visualizer</h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <Link href="/add">
          <Button className="w-full md:w-auto">➕ Add Transaction</Button>
        </Link>
        <Link href="/budget">
          <Button variant="outline" className="w-full md:w-auto">🎯 Set Budget</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <ul className="space-y-3">
            {transactions.map(txn => (
              <li key={txn._id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">₹{txn.amount}</p>
                  <p className="text-sm text-gray-600">{new Date(txn.date).toDateString()}</p>
                  <p className="text-sm">{txn.description}</p>
                  <p className="text-xs text-gray-500">{txn.category}</p>
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
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📊 Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Expenses This Month</p>
          <p className="text-2xl font-bold">₹{totalThisMonth}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Category Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Recent Transactions</p>
          <ul className="space-y-1">
            {recentTransactions.map(txn => (
              <li key={txn._id} className="text-sm">₹{txn.amount} - {txn.category}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📈 Budget vs Actual ({currentMonth})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetVsActualData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="budget" fill="#82ca9d" />
            <Bar dataKey="spent" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">💡 Spending Insights</h2>
        <ul className="list-disc ml-5 space-y-2">
          {budgetVsActualData.map(item => (
            <li key={item.category}>
              {item.category}: You have spent ₹{item.spent} out of ₹{item.budget}.
              {item.spent > item.budget
                ? ' ⚠️ Overspent!'
                : ` ✅ You have ₹${item.budget - item.spent} remaining.`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}