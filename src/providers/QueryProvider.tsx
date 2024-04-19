'use client';
import { z } from 'zod';
import { useEffect } from 'react';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const errorResponseSchema = z.object({
  message: z.string(),
  // error: z.string(),
  // error_description: z.string(),
});

type ErrorResponse = z.infer<typeof errorResponseSchema>;
const debouncedToastError = debounce(toast.error, 250);

const queryClient = new QueryClient();
const QueryProvider = ({ children }: Props) => {
  useEffect(() => {
    axios.defaults.baseURL = new URL('/api', location.origin).toString();
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }, []);
  useEffect(() => {
    axios.interceptors.response.use(
      (config) => config,
      (err: AxiosError<ErrorResponse>) => {
        const message = err.response?.data.message;
        debouncedToastError(message);

        throw err;
      }
    );
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
