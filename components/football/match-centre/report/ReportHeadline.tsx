interface Props {
  headline: string;
}

export default function ReportHeadline({
  headline,
}: Props) {

  return (

    <header className="mb-8 border-b pb-6">

      <h1 className="text-4xl font-black leading-tight">

        {headline}

      </h1>

    </header>

  );

}