import { Children } from "react";

export default function Container({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}
