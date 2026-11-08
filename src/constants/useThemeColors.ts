import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from './theme';

export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? Colors.dark : Colors.light;
}
