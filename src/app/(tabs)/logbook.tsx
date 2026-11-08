import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function LogbookScreen() {
  return (
    <ScreenPlaceholder
      title="Logbook"
      description="A record of your trips and time on the water."
      plannedFeatures={[
        'Log trips with start, destination and crew',
        'Track distance and conditions automatically',
        'Notes and photos per trip',
        'Season statistics',
      ]}
    />
  );
}
