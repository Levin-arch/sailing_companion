import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useThemeColors } from '@/constants/useThemeColors';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} color={color as string} size={size} />;
  };
}

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Conditions', tabBarIcon: tabIcon('partly-sunny-outline') }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan', tabBarIcon: tabIcon('map-outline') }} />
      <Tabs.Screen name="logbook" options={{ title: 'Logbook', tabBarIcon: tabIcon('book-outline') }} />
      <Tabs.Screen name="anchor" options={{ title: 'Anchor', tabBarIcon: tabIcon('boat-outline') }} />
    </Tabs>
  );
}
