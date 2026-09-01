import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a few moments.",
  icon,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-8 py-12 text-center">

      <div className="mb-4 text-4xl">
        {icon ?? "⚠️"}
      </div>

      <h3 className="text-lg font-semibold text-red-700">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-red-600">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}

    </div>
  );
}