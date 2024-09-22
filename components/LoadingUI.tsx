export default function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-300 dark:border-gray-50" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
}
