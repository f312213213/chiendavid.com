import { getAllTrips } from '@/lib/travel';
import HomeContent from './components/HomeContent';

export default async function Home() {
  const trips = await getAllTrips();
  const heroPins = trips
    .filter(t => t.lat != null && t.lng != null)
    .map(t => ({
      lat: t.lat!,
      lng: t.lng!,
      label: t.location.split(',')[0].trim(),
      slug: t.slug,
      title: t.title,
      coverSrc: t.coverSrc,
      coverBlur: t.coverBlurDataURL,
      displayDate: t.displayDate,
    }));

  return <HomeContent trips={trips} heroPins={heroPins} />;
}
