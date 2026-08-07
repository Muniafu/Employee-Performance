import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import {
  LayoutDashboard,
  Clock3,
  Plane,
  Wallet,
  Target,
  BookOpen,
  BriefcaseBusiness,
  Brain,
  HeartPulse,
  ShieldCheck,
  Rocket,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";

const NAVIGATION = [
  {
    section: "Main",
    roles: [
      "employee",
      "manager",
      "hr",
      "admin",
      "superuser",
    ],
    links: [
      {
        to: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        to: "/attendance",
        icon: Clock3,
        label: "Attendance",
      },
      {
        to: "/leave",
        icon: Plane,
        label: "Leave",
      },
      {
        to: "/payroll",
        icon: Wallet,
        label: "Payroll",
      },
    ],
  },

  {
    section: "Development",
    roles: [
      "employee",
      "manager",
      "hr",
      "admin",
      "superuser",
    ],
    links: [
      {
        to: "/performance",
        icon: Target,
        label: "Performance",
      },
      {
        to: "/learning",
        icon: BookOpen,
        label: "Learning",
      },
      {
        to: "/career",
        icon: BriefcaseBusiness,
        label: "Career",
      },
    ],
  },

  {
    section: "Organisation",
    roles: [
      "employee",
      "manager",
      "hr",
      "admin",
      "superuser",
    ],
    links: [
      {
        to: "/engagement",
        icon: Brain,
        label: "Engagement",
      },
      {
        to: "/wellness",
        icon: HeartPulse,
        label: "Wellness",
      },
      {
        to: "/compliance",
        icon: ShieldCheck,
        label: "Compliance",
      },
      {
        to: "/onboarding",
        icon: Rocket,
        label: "Onboarding",
      },
    ],
  },

  {
    section: "Administration",
    roles: [
      "admin",
      "hr",
      "superuser",
    ],
    links: [
      {
        to: "/employees",
        icon: Users,
        label: "Employees",
      },
      {
        to: "/analytics",
        icon: BarChart3,
        label: "Analytics",
      },
      {
        to: "/admin",
        icon: Settings,
        label: "Admin Panel",
      },
    ],
  },
];

export default function Sidebar({
  open,
  collapsed,
  onClose,
}) {
  const { user, logout } = useAuth();

  const sections = NAVIGATION.filter((section) =>
    section.roles.includes(
      (user?.role || "").toLowerCase()
    )
  );

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "sidebar",
          collapsed && "sidebar-collapsed",
          open && "sidebar-open"
        ]
        .filter(Boolean).join(" ")
      }
      >
        {/* Brand */}

        <div className="sidebar-brand">
          <div className="brand-icon">
            <Building2 size={22} />
          </div>

          <div className="sidebar-brand-text">
            <h1>EMS</h1>

            <span>
              Unified HR System
            </span>
          </div>
        </div>

        {/* Navigation */}

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <section
              key={section.section}
              className="nav-section"
            >
              <div className="nav-section-title">
                {section.section}
              </div>

              {section.links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link active"
                        : "nav-link"
                    }
                  >
                    <span className="nav-icon">
                      <Icon size={18} />
                    </span>

                    <span className="nav-text">
                      {link.label}
                    </span>
                  </NavLink>
                );
              })}
            </section>
          ))}
        </nav>

        {/* Footer */}

        <footer className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>

            <div className="sidebar-user-details">
              <div className="sidebar-user-name">
                {user?.firstName}{" "}
                {user?.lastName}
              </div>

              <div className="sidebar-user-role">
                {user?.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="nav-link nav-link-danger"
          >
            <span className="nav-icon">
              <LogOut size={18} />
            </span>

            <span className="nav-text">
              Sign Out
            </span>
          </button>
        </footer>
      </aside>
    </>
  );
}