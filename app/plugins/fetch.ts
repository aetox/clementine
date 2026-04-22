export default defineNuxtPlugin((nuxtApp) => {
  const { token, logout } = useAuth();
  
  const fetchOptions = {
    onRequest({ request, options }: any) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponseError({ response }: any) {
      if (response.status === 401) {
        logout();
      }
    }
  };

  // Prevent infinite loop on SSR
  if (import.meta.client) {
    globalThis.$fetch = $fetch.create(fetchOptions);
  } else {
    // on SSR, we don't want to re-wrap $fetch recursively
    // You could assign it to the nuxtApp for scoped requests
    const scopedFetch = $fetch.create(fetchOptions);
    nuxtApp.provide('fetch', scopedFetch);
  }
});