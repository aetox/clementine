<script setup lang="ts">
const route = useRoute();
const drawerId = "main-nav-drawer";
const { user, isAuthenticated, logout } = useAuth();

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/tournaments", label: "Tournois", icon: "trophy" },
  { to: "/teams", label: "Equipes", icon: "users" },
] as const;

function isActive(path: string) {
  if (path === "/dashboard") {
    return route.path === "/dashboard";
  }

  return route.path === path || route.path.startsWith(`${path}/`);
}

function closeDrawer() {
  const input = document.getElementById(drawerId) as HTMLInputElement | null;
  if (input) {
    input.checked = false;
  }
}
</script>

<template>
  <div class="min-h-screen app-shell">
    <div class="drawer lg:drawer-open">
      <input :id="drawerId" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">
        <div class="mx-auto max-w-7xl p-4 md:p-6">
          <div
            class="mb-4 flex items-center justify-between rounded-box panel p-3 lg:hidden"
          >
            <div>
              <p
                class="text-xs uppercase tracking-[0.26em] text-secondary font-bold"
              >
                Clementine
              </p>
              <p class="display-title text-xl text-neutral">Babyfoot</p>
            </div>
            <label
              :for="drawerId"
              class="btn btn-square btn-primary"
              aria-label="Ouvrir le menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </label>
          </div>

          <section class="min-w-0">
            <slot />
          </section>
        </div>
      </div>

      <div class="drawer-side z-20">
        <label
          :for="drawerId"
          class="drawer-overlay"
          aria-label="Fermer le menu"
        ></label>

        <aside class="w-72 p-4 md:p-6">
          <div class="panel rounded-box p-4 md:p-5 h-fit lg:sticky lg:top-4">
            <p
              class="text-xs uppercase tracking-[0.26em] text-secondary font-bold"
            >
              Clementine
            </p>
            <h1 class="display-title text-2xl text-neutral mt-1">Babyfoot</h1>

            <nav class="mt-6 grid gap-2">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="btn justify-start gap-3 border-none"
                :class="
                  isActive(item.to)
                    ? 'btn-primary shadow-md text-white'
                    : 'btn-ghost'
                "
                @click="closeDrawer"
              >
                <svg
                  v-if="item.icon === 'dashboard'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 13h7V4H4v9Zm9 7h7V11h-7v9Zm0-16v5h7V4h-7ZM4 20h7v-5H4v5Z"
                  />
                </svg>

                <svg
                  v-else-if="item.icon === 'trophy'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 4h8v3a4 4 0 0 1-8 0V4Zm8 1h3a2 2 0 0 1 0 4h-3M8 5H5a2 2 0 0 0 0 4h3m-1 7h10m-9 4h8"
                  />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="size-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 8v-1a4 4 0 0 0-4-4h-1m-7 5v-1a4 4 0 0 1 4-4h1"
                  />
                </svg>

                <span>{{ item.label }}</span>
              </NuxtLink>
            </nav>
            <div class="mt-8 border-t border-base-200 pt-4">
              <template v-if="isAuthenticated">
                <div class="mb-4">
                  <p class="text-sm opacity-70">Connecté en tant que</p>
                  <p class="font-bold">{{ user?.name || user?.email }}</p>
                  <span class="badge badge-sm badge-primary mt-1">{{ user?.role }}</span>
                </div>
                <button class="btn btn-outline btn-error w-full btn-sm" @click="logout">Deconnexion</button>
              </template>
              <template v-else>
                <NuxtLink to="/login" class="btn btn-primary w-full btn-sm text-white mb-2">Se connecter</NuxtLink>
                <NuxtLink to="/register" class="btn btn-outline w-full btn-sm">S'inscrire</NuxtLink>
              </template>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
