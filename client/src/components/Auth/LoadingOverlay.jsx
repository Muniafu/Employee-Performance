export default function LoadingOverlay({
  loading,
  message = "Loading...",
}) {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-card">

        <div className="spinner" />

        <p>{message}</p>

      </div>
    </div>
  );
}