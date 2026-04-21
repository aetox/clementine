import { useState, useCookie } from '#app';

export const useAuth = () => {
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 });
  const user = useState<any>('user', () => null);

  const fetchUser = async () => {
    if (!token.value) {
      user.value = null;
      return;
    }
    try {
      const { user: fetchedUser } = await $fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      user.value = fetchedUser;
    } catch (e) {
      token.value = null;
      user.value = null;
    }
  };

  const login = async (credentials: any) => {
    const data = await $fetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    token.value = data.token;
    user.value = data.user;
  };

  const register = async (credentials: any) => {
    const data = await $fetch<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: credentials,
    });
    token.value = data.token;
    user.value = data.user;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo('/login');
  };

  const initAuth = async () => {
    if (token.value && !user.value) {
      await fetchUser();
    }
  };

  return {
    user,
    token,
    login,
    register,
    logout,
    initAuth,
    fetchUser,
    isAdmin: computed(() => user.value?.role === 'ADMIN'),
    isAuthenticated: computed(() => !!user.value),
  };
};