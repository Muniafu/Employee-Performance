import AuthBrand from "./AuthBrand";
import AuthHero from "./AuthHero";
import AuthFooter from "./AuthFooter";
import ThemeToggle from "./ThemeToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      
      <ThemeToggle />
      
      <main className="auth-main">

        <aside className="auth-left">
          <AuthBrand />
          <AuthHero />
        </aside>

        <section className="auth-right">
          {children}
        </section>

      </main>
      
      <AuthFooter />

    </div>
  );
}