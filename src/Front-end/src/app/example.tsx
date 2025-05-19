import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function ExampleComponent() {
  const { data: users, loading, error, execute: fetchUsers } = useApi<User[]>(
    () => api.get('/users').then(res => res.data)
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      {users?.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
} 