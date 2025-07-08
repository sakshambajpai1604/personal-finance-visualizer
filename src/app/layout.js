export const metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track your expenses and budgets easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}