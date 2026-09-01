import type { ReactNode } from "react";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
}

export default function CardHeader({
  title,
  subtitle,
  icon,
  right,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1 text-gray-700">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {right}
    </div>
  );
}