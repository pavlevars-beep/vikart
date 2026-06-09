import { NextRequest, NextResponse } from 'next/server';
import { getIncidents, getLastRefresh, ensureBackgroundRefresh } from '@/lib/data-store';
import { NewsApiResponse, Region } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<NewsApiResponse>> {
  ensureBackgroundRefresh();

  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') as Region | null;

  const incidents =
    region && (region === 'serbia' || region === 'world')
      ? getIncidents(region)
      : getIncidents();

  return NextResponse.json({
    incidents,
    total: incidents.length,
    lastUpdated: getLastRefresh(),
  });
}
