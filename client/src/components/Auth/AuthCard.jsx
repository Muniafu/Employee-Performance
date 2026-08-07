export default function AuthCard({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="auth-card">

      <header className="auth-card-header">

        <h2 className="auth-card-title">
          {title}
        </h2>

        {subtitle && (
          <p className="auth-card-subtitle">
            {subtitle}
          </p>
        )}

      </header>

      <div className="auth-card-body">

        {children}

      </div>

    </div>
  );
}