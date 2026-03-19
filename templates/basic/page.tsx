export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="mb-4 text-3xl font-bold">Welcome to Next.js!</h1>
        <p className="mb-8 text-lg text-gray-600">Get started by editing app/page.tsx</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <a
            href="https://nextjs.org/docs"
            className="rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <h2 className="mb-2 text-xl font-semibold">Documentation →</h2>
            <p className="text-gray-600 dark:text-gray-400">Learn about Next.js in the official documentation.</p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <h2 className="mb-2 text-xl font-semibold">Learn →</h2>
            <p className="text-gray-600 dark:text-gray-400">Learn Next.js by building a dashboard application.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app"
            className="rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <h2 className="mb-2 text-xl font-semibold">Deploy →</h2>
            <p className="text-gray-600 dark:text-gray-400">Instantly deploy your Next.js site to Vercel.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
