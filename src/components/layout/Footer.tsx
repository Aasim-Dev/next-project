// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-4 mt-8">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} PhotoHire — All rights reserved.
      </div>
    </footer>
  );
}
