'use client';

import { useEffect } from 'react';
import { useGetApiDataQuery } from './_hooks';

export default function Dashboard() {
  // const { profileData } = useAuthentication();

  const { data, isLoading } = useGetApiDataQuery();

  useEffect(() => {
    console.log('data: ', data);
  }, [data]);

  return <div>{isLoading ? 'isLoading...' : 'dashboard here'}</div>;
}
