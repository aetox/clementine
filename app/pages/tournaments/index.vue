<script setup lang="ts">
const {
  tournaments,
  loading,
  error,
  fetchTournaments,
  createTournament,
  deleteTournament,
} = useTournaments();
const { isAdmin } = useAuth();

await fetchTournaments();

async function onCreateTournament(payload: {
  name: string;
  date: string;
  description?: string;
}) {
  await createTournament(payload);
}
</script>

<template>
  <main class="space-y-5">
    <section class="hero-panel rounded-box p-6 enter-fade">
      <p class="text-xs uppercase tracking-[0.28em] text-accent font-bold">
        Tournois
      </p>
      <h2 class="display-title text-3xl mt-2">{{ isAdmin ? 'Creer et gerer' : 'Tournois disponibles' }}</h2>
    </section>

    <TournamentForm v-if="isAdmin" @submit="onCreateTournament" />

    <section v-if="loading" class="alert"><span>Chargement...</span></section>
    <section v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </section>

    <section v-else class="grid gap-3">
      <article
        v-for="tournament in tournaments"
        :key="tournament.id"
        class="panel rounded-box p-4"
      >
        <div class="flex flex-wrap justify-between items-start gap-3">
          <div>
            <p class="font-semibold text-lg">{{ tournament.name }}</p>
            <p class="text-sm opacity-70">
              {{ new Date(tournament.date).toLocaleDateString("fr-FR") }}
            </p>
          </div>
          <div class="flex gap-2">
            <NuxtLink
              class="btn btn-sm btn-primary text-white"
              :to="`/tournaments/${tournament.id}`"
            >
              Ouvrir
            </NuxtLink>
            <button
              v-if="isAdmin"
              class="btn btn-sm btn-outline btn-error"
              @click="deleteTournament(tournament.id)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </article>
      <p v-if="!tournaments.length" class="opacity-70">
        Aucun tournoi pour le moment.
      </p>
    </section>
  </main>
</template>
