export default function NotFound() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#cc0000",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Go back home
      </a>
    </main>
  );
}