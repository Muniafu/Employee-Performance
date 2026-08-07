import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (

    <div className="theme-toggle-wrapper">

      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label="Toggle Theme"
      >

        {
          theme === "light"
            ? <Moon size={20}/>
            : <Sun size={20}/>
        }

      </button>

    </div>

  );
}