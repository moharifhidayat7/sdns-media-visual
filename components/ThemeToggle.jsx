import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </ActionIcon>
  );
};

export default ThemeToggle;
