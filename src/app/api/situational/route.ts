import { NextResponse } from 'next/server';
import { getSituationalAnalysis, getLastRefresh, ensureBackgroundRefresh } from '@/lib/data-store';
import { SituationalApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<SituationalApiResponse>> {
  ensureBackgroundRefresh();

  return NextResponse.json({
    analysis: getSituationalAnalysis(),
    lastUpdated: getLastRefresh(),
  });
}
