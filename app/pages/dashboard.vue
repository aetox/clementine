<script setup lang="ts">
const { tournaments, fetchTournaments } = useTournaments();
const { teams, fetchTeams } = useTeams();

await Promise.all([fetchTournaments(), fetchTeams()]);

const stats = computed(() => {
  const tournamentCount = tournaments.value.length;
  const teamCount = teams.value.length;
  const matchCount = tournaments.value.reduce(
    (acc, tournament) => acc + tournament.matches.length,
    0,
  );
  const playedCount = tournaments.value.reduce(
    (acc, tournament) =>
      acc + tournament.matches.filter((match) => match.played).length,
    0,
  );

  return { tournamentCount, teamCount, matchCount, playedCount };
});
</script>

<template>
  <main class="space-y-5">
    <section class="hero-panel rounded-box p-6 md:p-8 enter-fade">
      <p class="text-xs uppercase tracking-[0.3em] text-accent font-bold">
        Dashboard
      </p>
      <h2 class="display-title text-3xl md:text-4xl mt-2">Recap global</h2>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article class="panel rounded-box p-4">
        <p class="text-sm opacity-70">Tournois</p>
        <p class="text-3xl font-bold mt-1">{{ stats.tournamentCount }}</p>
      </article>
      <article class="panel rounded-box p-4">
        <p class="text-sm opacity-70">Equipes</p>
        <p class="text-3xl font-bold mt-1">{{ stats.teamCount }}</p>
      </article>
      <article class="panel rounded-box p-4">
        <p class="text-sm opacity-70">Matchs</p>
        <p class="text-3xl font-bold mt-1">{{ stats.matchCount }}</p>
      </article>
      <article class="panel rounded-box p-4">
        <p class="text-sm opacity-70">Scores saisis</p>
        <p class="text-3xl font-bold mt-1">{{ stats.playedCount }}</p>
      </article>
    </section>

    <section class="panel rounded-box p-5">
      <h3 class="display-title text-2xl">Tournois recents</h3>
      <div class="mt-4 grid gap-3">
        <NuxtLink
          v-for="tournament in tournaments"
          :key="tournament.id"
          class="card panel p-4 lift-on-hover"
          :to="`/tournaments/${tournament.id}`"
        >
          <p class="font-semibold">{{ tournament.name }}</p>
          <p class="text-sm opacity-70">
            {{ new Date(tournament.date).toLocaleDateString("fr-FR") }}
          </p>
        </NuxtLink>
        <p v-if="!tournaments.length" class="opacity-70">Aucun tournoi cree.</p>
      </div>
    </section>
  </main>
</template>
