"use client";

import { THEME_KEYS, COLOR_THEMES, type ThemeKey } from "./color-themes";

interface ColorSelectorProps {
  selected: ThemeKey;
  onChange: (theme: ThemeKey) => void;
}

export default function ColorSelector({
  selected,
  onChange,
}: ColorSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      {THEME_KEYS.map((key) => {
        const theme = COLOR_THEMES[key];
        const isSelected = key === selected;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`w-7 h-7 rounded-full ${theme.swatch} transition-all cursor-pointer ${
              isSelected
                ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                : "hover:scale-110 opacity-60 hover:opacity-100"
            }`}
            aria-label={`${theme.label} theme`}
            aria-pressed={isSelected}
          />
        );
      })}
    </div>
  );
}
