export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* This bypasses the need for a local CSS file entirely */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}