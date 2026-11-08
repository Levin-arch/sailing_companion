import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ConditionsScreen() {
  return (
    <ScreenPlaceholder
      title="Conditions"
      description="Weather, wind and tides for where you are sailing."
      plannedFeatures={[
        'Wind speed, direction and gusts',
        'Hourly and multi-day forecasts',
        'Tide times and heights for nearby stations',
        'Currents and sea state',
      ]}
    />
  );
}
