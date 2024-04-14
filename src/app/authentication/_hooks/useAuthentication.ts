import { useContext } from 'react';

import { AuthContext } from '@/providers/AuthProvider';

const useAuthentication = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Invalid use.');
  return ctx;
};
export default useAuthentication;
