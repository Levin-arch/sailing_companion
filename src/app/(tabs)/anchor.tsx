import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function AnchorScreen() {
  return (
    <ScreenPlaceholder
      title="Anchor alarm"
      description="Get alerted if the boat drifts away from where you dropped anchor."
      plannedFeatures={[
        'Set anchor position from GPS',
        'Adjustable swing radius',
        'Alarm when the boat leaves the radius, also in the background',
        'Track of boat movement while at anchor',
      ]}
    />
  );
}
