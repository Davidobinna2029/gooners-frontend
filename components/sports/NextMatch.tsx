export default function NextMatch({
  match,
}: any) {
  if (!match)
    return null;

  return (
    <section className="next-match">
      <h2>Next Match</h2>

      <div className="next-match-card">
        <p>Arsenal</p>

        <strong>VS</strong>

        <p>Opponent</p>
      </div>
    </section>
  );
}