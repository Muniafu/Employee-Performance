import {
  ShieldCheck,
  Users,
  Briefcase,
  CalendarCheck,
  Wallet,
  BarChart3,
  CalendarDays,
  Bell,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Role-based access control with secure authentication.",
  },
  {
    icon: CalendarDays,
    title: "Attendance",
    description:
      "Track employee attendance in real time.",
  },
  {
    icon: Wallet,
    title: "Payroll Automation",
    description:
      "Automated payroll generation and payslips.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Manage departments, positions, and staff records.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Email and in-app notifications for important events.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Tracking",
    description:
      "Monitor attendance with automated check-in records."
  },
  {
    icon: Briefcase,
    title: "Leave Management",
    description:
      "Approve and manage employee leave requests."
  },
  {
    icon: BarChart3,
    title: "HR Analytics",
    description:
      "Monitor workforce performance with dashboards.",
  }
];

export default function AuthHero({
  subtitle = "Everything your organization needs to manage its workforce efficiently.",

}) {
  return (
    <section className="auth-feature">
      <div className="auth-feature-header">

        <p>{subtitle}</p>
      </div>

      <div className="auth-feature-list">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="auth-feature-item"
            >
              <div className="feature-icon">
                <Icon size={22} />
              </div>

              <div className="feature-content">
                <h4>{feature.title}</h4>

                <p>
                  {feature.description}
                </p>
              </div>

              <CheckCircle2
                size={18}
                className="feature-check"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}