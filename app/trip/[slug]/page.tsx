import { notFound } from 'next/navigation';
import { getAllTrips } from '@/lib/travel';
import HomeContent from '@/app/components/HomeContent';
import TripDetailDialog from '@/app/components/TripDetailDialog';

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trips = await getAllTrips();
  const trip = trips.find(t => t.slug === slug);
  if (!trip) notFound();

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

  return (
    <>
      <HomeContent trips={trips} heroPins={heroPins} enableClientDialog={false} />
      <TripDetailDialog trips={trips} trip={trip} closeBehavior="home" />
    </>
  );
}
