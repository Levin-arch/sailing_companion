import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/constants/useThemeColors';

type Props = {
  title: string;
  description: string;
  plannedFeatures: string[];
};

export function ScreenPlaceholder({ title, description, plannedFeatures }: Props) {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Coming soon</Text>
        {plannedFeatures.map((feature) => (
          <Text key={feature} style={[styles.feature, { color: colors.textMuted }]}>
            • {feature}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  description: { fontSize: 16, lineHeight: 22 },
  card: { marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, gap: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  feature: { fontSize: 15, lineHeight: 21 },
});
