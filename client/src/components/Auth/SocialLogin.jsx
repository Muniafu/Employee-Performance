import {
  Chrome,
  Github,
  Building2,
} from "lucide-react";

const providers = [
  {
    name: "Google",
    icon: Chrome,
  },
  {
    name: "GitHub",
    icon: Github,
  },
  {
    name: "Microsoft",
    icon: Building2,
  },
];

export default function SocialLogin() {
  const handleClick = (provider) => {
    // Future OAuth integration
    console.log(
      `${provider} login coming soon`
    );
  };

  return (
    <div className="social-login">

      <div className="social-divider">
        <span>or continue with</span>
      </div>

      <div className="social-buttons">

        {providers.map((provider) => {
          const Icon = provider.icon;

          return (
            <button
              key={provider.name}
              type="button"
              onClick={() => handleClick(provider.name)}
              className="social-btn"
            >
              <Icon size={18} />
              <span>{provider.name}</span>
            </button>
          );
        })}

      </div>

    </div>
  );
}