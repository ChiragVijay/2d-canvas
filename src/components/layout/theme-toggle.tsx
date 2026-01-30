import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme} className="h-8 w-8" title={`Theme: ${theme}`}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle theme (current: {theme})</span>
    </Button>
  );
}
