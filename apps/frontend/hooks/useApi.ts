import { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { createApi } from '../services/api';

export const useApi = () => {
  const { user } = useUser();

  const api = useMemo(() => {
    return createApi(user);
  }, [user]);

  return api;
};