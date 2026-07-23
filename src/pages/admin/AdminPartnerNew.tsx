import { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { createBlankPartner } from '@/services/partnersStore';

export default function AdminPartnerNew() {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) idRef.current = createBlankPartner().id;
  return <Navigate to={`/admin/partneri/${idRef.current}`} replace />;
}
