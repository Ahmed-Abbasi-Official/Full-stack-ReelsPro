'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    themeMode: string;
    setThemeMode: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'light',
    setThemeMode: () => {}
})

export const ThemeProvider = ( {children}: { children: ReactNode} ) => {
    const [themeMode, setThemeMode] = useState("light");
     useEffect(() => {
        const storedTheme = localStorage.getItem("app-theme") || "light";
        setThemeMode(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
    }, []);

    useEffect(() => {
        if (themeMode) {
            document.documentElement.setAttribute("data-theme", themeMode);
            localStorage.setItem("app-theme", themeMode);
        }
    }, [themeMode]);

    if (!themeMode) return null;

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>

    )
}

export default function useTheme() {
    return useContext(ThemeContext)
}