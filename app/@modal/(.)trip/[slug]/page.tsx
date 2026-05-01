import { notFound } from 'next/navigation';
import { getAllTrips } from '@/lib/travel';
import TripDetailDialog from '@/app/components/TripDetailDialog';

export default async function InterceptedTripModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trips = await getAllTrips();
  const trip = trips.find(t => t.slug === slug);
  if (!trip) notFound();
  return <TripDetailDialog trips={trips} trip={trip} closeBehavior="back" />;
}
