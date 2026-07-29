import TacticalSection from "./TacticalSection";
import type { TacticalSectionData } from "./tactical.types";

interface Props {
  attacking: TacticalSectionData;
  defending: TacticalSectionData;
  transition: TacticalSectionData;
  possession: TacticalSectionData;
}

export default function TacticalBoard({
  attacking,
  defending,
  transition,
  possession,
}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">

        Tactical Insights

      </h2>

      <div className="grid gap-8 lg:grid-cols-2">

        <TacticalSection
          section={attacking}
        />

        <TacticalSection
          section={defending}
        />

        <TacticalSection
          section={transition}
        />

        <TacticalSection
          section={possession}
        />

      </div>

    </section>

  );

}