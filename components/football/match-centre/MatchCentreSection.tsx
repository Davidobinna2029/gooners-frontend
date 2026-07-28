import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function MatchCentreSection({
  title,
  children,
}: Props) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">

      <header className="border-b px-6 py-4">

        <h2 className="text-lg font-bold">
          {title}
        </h2>

      </header>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}