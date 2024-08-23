import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

// สร้างค่าพื้นฐานสำหรับ ThemeProviderState
const initialState = {
  theme: "light", // เปลี่ยนเป็นค่าเริ่มต้นที่ต้องการ
  setTheme: () => null,
};

// สร้าง Context สำหรับ ThemeProvider
const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  storageKey = "vite-ui-theme",
  ...props
}) {
  // ตั้งค่าครีเอเตอร์ให้กับ state theme จาก localStorage หรือ defaultTheme
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : "light"; // ตรวจสอบค่า
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // ลบคลาสที่ไม่จำเป็นออก
    root.classList.remove("light", "dark");

    // กำหนดคลาสใหม่ตามธีมที่เลือก
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      if (theme === "dark" || theme === "light") {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  storageKey: PropTypes.string,
};

// Custom hook สำหรับใช้ ThemeProviderContext
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
