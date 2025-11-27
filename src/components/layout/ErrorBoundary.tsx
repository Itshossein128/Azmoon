
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Bug } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: number | undefined;
  let errorStack: string | undefined;

  if (isRouteErrorResponse(error)) {
    // Error response from a loader, action, or route component
    errorStatus = error.status;
    errorMessage = error.statusText || 'An unexpected route error occurred.';
    if (error.data?.message) {
      errorMessage = error.data.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack;
  } else {
    errorMessage = 'An unknown error occurred.';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-gray-900 text-center p-4">
      <Bug className="w-24 h-24 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-red-700 dark:text-red-400 mb-2">
        {errorStatus ? `${errorStatus}: خطای غیرمنتظره در برنامه!` : 'خطای غیرمنتظره در برنامه!'}
      </h1>
      <p className="text-lg text-red-600 dark:text-red-300 mb-6">
        متاسفانه مشکلی پیش آمده است. لطفاً صفحه را رفرش کنید یا بعداً دوباره تلاش کنید.
      </p>

      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative max-w-2xl w-full">
          <strong className="font-bold">پیام خطا:</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}

      {errorStack && (
        <details className="mt-4 text-left max-w-2xl w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
            جزئیات فنی (برای توسعه‌دهندگان)
          </summary>
          <pre className="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
            <code>{errorStack}</code>
          </pre>
        </details>
      )}
    </div>
  );
}
