'use client';

import axios from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import supabaseClient from '@/utils/supabase/client';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('accessToken');
  if (!access_token) return config;
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

const queryClient = new QueryClient();
const QueryProvider = ({ children }: Props) => {
  useEffect(() => {
    (async () => {
      const session = await supabaseClient.auth.getSession();
      const { access_token } = session.data.session ?? {};
      if (access_token) {
        localStorage.setItem('accessToken', access_token);
        return;
      }
      localStorage.removeItem('accessToken');
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
