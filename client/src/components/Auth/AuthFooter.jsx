import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Copyright,
} from "lucide-react";

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="auth-footer">

      <div className="auth-footer-top">

        <div className="auth-footer-security">

          <ShieldCheck size={16} />

          <span>
            Enterprise Grade Security
          </span>

        </div>

        <div className="auth-footer-security">

          <Lock size={16} />

          <span>
            SSL Encrypted Connection
          </span>

        </div>

      </div>

      <div className="auth-footer-links">

        <Link to="/privacy-policy">
          Privacy Policy
        </Link>

        <span>•</span>

        <Link to="/terms">
          Terms of Service
        </Link>

        <span>•</span>

        <Link to="/support">
          Support
        </Link>

        <span>•</span>

        <Link to="/contact">
          Contact
        </Link>

      </div>

      <div className="auth-footer-bottom">

        <div className="copyright">

          <Copyright size={14} />

          <span>
            {year} EMS Enterprise.
            All rights reserved.
          </span>

        </div>

        <div className="version">

          Version 1.0.0.0

        </div>

      </div>

    </footer>
  );
}