import { Building2 } from "lucide-react";

export default function AuthBrand() {
  return (
    <header className="auth-brand">

      <div className="brand-logo">

        <Building2 size={42} />

      </div>

      <div className="brand-content">

        <h1 className="brand-title">
          EMS Unified HR
        </h1>

        <p className="brand-subtitle">
          Enterprise Workforce Management Platform
        </p>

      </div>

    </header>
  );
}