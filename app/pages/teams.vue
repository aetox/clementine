<script setup lang="ts">
const { tournaments, fetchTournaments } = useTournaments();
const { teams, loading, error, fetchTeams, createTeam, deleteTeam } =
  useTeams();
const { isAdmin } = useAuth();

const form = reactive({
  name: "",
  tournamentId: 0,
});

await Promise.all([fetchTournaments(), fetchTeams()]);

watch(
  () => tournaments.value,
  (value) => {
    if (!form.tournamentId && value.length > 0) {
      form.tournamentId = value[0]?.id ?? 0;
    }
  },
  { immediate: true },
);

async function onCreateTeam() {
  if (!form.tournamentId) {
    return;
  }

  await createTeam({
    name: form.name,
    tournamentId: form.tournamentId,
  });

  form.name = "";
}
</script>

<template>
  <main class="space-y-5">
    <section class="hero-panel rounded-box p-6 enter-fade">
      <p class="text-xs uppercase tracking-[0.28em] text-accent font-bold">
        Equipes
      </p>
      <h2 class="display-title text-3xl mt-2">Creation et liste des equipes</h2>
    </section>

    <section v-if="isAdmin" class="panel rounded-box p-5">
      <form
        class="grid md:grid-cols-[1fr_220px_auto] gap-3 items-end"
        @submit.prevent="onCreateTeam"
      >
        <label class="form-control">
          <span class="label-text mb-2 block">Nom d'equipe</span>
          <input
            v-model="form.name"
            class="input input-bordered input-secondary"
            required
          />
        </label>

        <label class="form-control">
          <span class="label-text mb-2 block">Tournoi</span>
          <select
            v-model.number="form.tournamentId"
            class="select select-bordered select-secondary"
            required
          >
            <option
              v-for="tournament in tournaments"
              :key="tournament.id"
              :value="tournament.id"
            >
              {{ tournament.name }}
            </option>
          </select>
        </label>

        <button
          class="btn btn-primary"
          type="submit"
          :disabled="!tournaments.length"
        >
          Ajouter
        </button>
      </form>
      <p v-if="!tournaments.length" class="text-sm opacity-70 mt-3">
        Cree d'abord un tournoi pour pouvoir ajouter des equipes.
      </p>
    </section>

    <section v-if="loading" class="alert"><span>Chargement...</span></section>
    <section v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </section>

    <section v-else class="grid gap-3">
      <article
        v-for="team in teams"
        :key="team.id"
        class="panel rounded-box p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold">{{ team.name }}</p>
            <p class="text-sm opacity-70">
              Tournoi: {{ team.tournament?.name || "Inconnu" }}
            </p>
          </div>
          <button
            v-if="isAdmin"
            class="btn btn-sm btn-outline btn-error"
            @click="deleteTeam(team.id)"
          >
            Supprimer
          </button>
        </div>
      </article>

      <p v-if="!teams.length" class="opacity-70">Aucune equipe enregistree.</p>
    </section>
  </main>
</template>
