import {
  Building2,
  Users,
  ShieldCheck,
  CalendarCheck2,
  Wallet,
} from "lucide-react";

export default function AuthIllustration({
  title = "Unified HR Management System",
  subtitle = "A secure, intelligent platform for managing employees, attendance, payroll, leave, and organizational workflows.",
  logo = null,
}) {
  const stats = [
    {
      icon: Users,
      value: "Employees",
    },
    {
      icon: CalendarCheck2,
      value: "Attendance",
    },
    {
      icon: Wallet,
      value: "Payroll",
    },
    {
      icon: ShieldCheck,
      value: "Security",
    },
  ];

  return (
    <section className="auth-illustration">

      <div className="auth-overlay" />

      <div className="illustration-brand">

        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="auth-logo"
          />
        ) : (
          <div className="brand-icon">
            <Building2 size={48} />
          </div>
        )}

        <h1>{title}</h1>

        <p>{subtitle}</p>

      </div>

      <div className="auth-stats">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="auth-stat-card"
            >
              <Icon size={22} />

              <span>{item.value}</span>
            </div>
          );
        })}

      </div>

    </section>
  );
}