// TODO: Implement useAuth hook
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Implement authentication logic
  
  return {
    user,
    loading,
    login: () => {}, // TODO
    logout: () => {}, // TODO
    register: () => {}, // TODO
  };
}
