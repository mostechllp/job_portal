import { useAuthInit } from "./hooks/useAuthInit";
import { HomePage } from "./pages/HomePage";

export function App() {
  const { token, isInitialized } = useAuthInit();

  if (token && !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <HomePage />;
}