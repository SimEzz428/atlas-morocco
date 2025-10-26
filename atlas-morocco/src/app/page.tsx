export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Atlas Morocco
        </h1>
        <p className="text-lg text-slate-600">
          Welcome to Atlas Morocco - Your Travel Planning Companion
        </p>
        <div className="mt-8">
          <a 
            href="/auth/signin" 
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Sign In
          </a>
          <a 
            href="/auth/signup" 
            className="inline-block bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors ml-4"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}