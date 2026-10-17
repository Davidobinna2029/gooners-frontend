export const metadata = {
  title: "Live Football Scores | ArsenalTalks",
  description:
    "Follow live football scores, today's fixtures and match results on ArsenalTalks.",
};

export default function LivescoresPage() {
  return (
    <main className="livescores-page">
      <div className="livescores-header">
        <p className="livescores-eyebrow">ARSENALTALKS</p>
        <h1>Live Football Scores</h1>
        <p>
          Follow today's football scores and keep up with the action.
        </p>
      </div>

      <section
        className="livescores-widget"
        aria-label="Live football scores"
      >
        <iframe
          src="https://www.livescore.bz/webmasters.asp?lang=en&sport=football(soccer)&data-1=today&data-2=&word=livescore%20today"
          title="Live football scores"
          width="100%"
          height="5000"
          scrolling="auto"
          loading="lazy"
          style={{ display: "block", width: "100%", height: "5000px", border: 0 }}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </section>
    </main>
  );
}
