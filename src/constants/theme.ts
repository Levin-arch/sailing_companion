export const Colors = {
  light: {
    text: '#0B1F33',
    textMuted: '#4A5D70',
    background: '#F4F8FB',
    card: '#FFFFFF',
    border: '#D5E1EA',
    tint: '#0A6EBD',
    danger: '#C62828',
  },
  dark: {
    text: '#E6EEF5',
    textMuted: '#9AB0C3',
    background: '#06121F',
    card: '#0E2236',
    border: '#1E3850',
    tint: '#4DA8F0',
    danger: '#EF5350',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];
