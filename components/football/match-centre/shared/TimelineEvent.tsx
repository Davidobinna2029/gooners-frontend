interface Props {
  minute: string;
  icon: string;
  title: string;
  description?: string;
}

export default function TimelineEvent({
  minute,
  icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
        {icon}
      </div>

      <div className="flex-1">

        <div className="flex items-center justify-between">

          <h4 className="font-semibold text-gray-900">
            {title}
          </h4>

          <span className="text-sm font-bold text-red-600">
            {minute}'
          </span>

        </div>

        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}

      </div>

    </div>
  );
}