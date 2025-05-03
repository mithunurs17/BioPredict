import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-muted transition-colors"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "light" ? (
        <i className="ri-moon-line h-4 w-4" />
      ) : (
        <i className="ri-sun-line h-4 w-4" />
      )}
    </Button>
  );
}
