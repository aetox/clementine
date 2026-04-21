export default defineNuxtPlugin((nuxtApp) => {
  const { token, logout } = useAuth();
  
  globalThis.$fetch = $fetch.create({
    onRequest({ request, options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        logout();
      }
    }
  });
});