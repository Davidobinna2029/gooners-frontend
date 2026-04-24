export default function Newsletter() {
  return (
    <div className="panel">
      <h2>Join ArsenalTalks</h2>
      <p>Get Arsenal updates by email.</p>

      <form className="newsletter-form">
        <input
          type="email"
          placeholder="Your email"
        />
        <button type="submit">
          Subscribe
        </button>
      </form>
    </div>
  );
}