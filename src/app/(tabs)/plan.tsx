import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function PlanScreen() {
  return (
    <ScreenPlaceholder
      title="Trip planning"
      description="Plan routes and passages before you leave the harbour."
      plannedFeatures={[
        'Routes with waypoints on a map',
        'Distance and estimated passage time',
        'Forecast along the route',
        'Pre-departure safety checklist',
      ]}
    />
  );
}
