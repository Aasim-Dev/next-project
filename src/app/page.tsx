export default function HomePage() {
  return (
    <section className="text-center">
      <div className="py-20">
        <h1 className="text-5xl font-bold">Welcome to MySite</h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Your trusted platform to manage users, roles, and more.
        </p>
        <div className="mt-8 space-x-4">
          <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Get Started</a>
          <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12 px-6">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2">Secure Login</h3>
          <p>Authenticate users securely using modern practices like bcrypt & JWT.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2">Role Management</h3>
          <p>Support for multiple roles like admin and user built into the system.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
          <p>Built with Next.js, MongoDB, and TailwindCSS for performance & design.</p>
        </div>
      </div>
    </section>
  );
}