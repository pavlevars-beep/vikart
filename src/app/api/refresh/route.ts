import { NextResponse } from 'next/server';
import { refreshData, getLastRefresh, isRefreshing } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<NextResponse> {
  if (isRefreshing()) {
    return NextResponse.json(
      { message: 'Osvežavanje je već u toku.', isRefreshing: true },
      { status: 202 }
    );
  }

  await refreshData();

  return NextResponse.json({
    message: 'Podaci su uspešno osveženi.',
    lastUpdated: getLastRefresh(),
    isRefreshing: false,
  });
}
