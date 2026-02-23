import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-9xl font-bold text-purple-600 dark:text-purple-400">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="mt-8 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
