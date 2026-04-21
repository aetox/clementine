<script setup lang="ts">
import type { MatchDTO, TournamentDTO } from "../../../shared/types";

const route = useRoute();
const tournamentId = Number(route.params.id);

const { fetchTournamentById, generateMatches, updateMatchScore } =
  useTournaments();
const { teams, fetchTeams, createTeam } = useTeams();

const tournament = ref<TournamentDTO | null>(null);
const selectedMatch = ref<MatchDTO | null>(null);
const scoreModalOpen = ref(false);
const addTeamModalOpen = ref(false);
const loading = ref(false);

async function loadTournament() {
  loading.value = true;
  tournament.value = await fetchTournamentById(tournamentId);
  loading.value = false;
}

await Promise.all([loadTournament(), fetchTeams()]);

const allTeamNames = computed(() => {
  const set = new Set(teams.value.map((t) => t.name));
  return Array.from(set);
});

const rounds = computed(() => {
  if (!tournament.value) {
    return [] as Array<{ round: number; matches: MatchDTO[] }>;
  }

  const grouped = new Map<number, MatchDTO[]>();

  for (const match of tournament.value.matches) {
    const existing = grouped.get(match.round) ?? [];
    existing.push(match);
    grouped.set(match.round, existing);
  }

  return [...grouped.entries()]
    .map(([round, matches]) => ({ round, matches }))
    .sort((a, b) => a.round - b.round);
});

function onOpenScoreModal(match: MatchDTO) {
  selectedMatch.value = match;
  scoreModalOpen.value = true;
}

async function onSaveScore(payload: {
  matchId: number;
  homeScore: number;
  awayScore: number;
}) {
  await updateMatchScore(payload.matchId, payload.homeScore, payload.awayScore);
  scoreModalOpen.value = false;
  selectedMatch.value = null;
  await loadTournament();
}

async function onGenerateMatches() {
  await generateMatches(tournamentId);
  await loadTournament();
}

async function onAddTeam(name: string) {
  addTeamModalOpen.value = false;
  await createTeam({
    name,
    tournamentId,
  });
  await loadTournament();
  await fetchTeams();
}
</script>

<template>
  <main class="space-y-5">
    <section class="hero-panel rounded-box p-6 enter-fade">
      <div class="flex justify-between items-start flex-wrap gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.28em] text-accent font-bold">
            Tournoi
          </p>
          <h2 class="display-title text-3xl mt-2">{{ tournament?.name }}</h2>
          <p class="mt-2 text-base-200/90 text-sm">
            Ici, gere les participants et le planning des matchs.
          </p>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button
            class="btn btn-secondary shadow-md font-bold"
            @click="addTeamModalOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Ajouter une equipe
          </button>
          
          <button
            class="btn btn-primary shadow-md font-bold"
            @click="onGenerateMatches"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586Z" /></svg>
            Generer le planning
          </button>
        </div>
      </div>
    </section>

    <!-- Liste des equipes du tournoi -->
    <section v-if="tournament?.teams?.length" class="panel rounded-box p-4 enter-fade">
      <h3 class="display-title text-xl text-neutral mb-3">Equipes inscrites ({{ tournament.teams.length }})</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="team in tournament.teams" :key="team.id" class="badge badge-accent badge-lg font-semibold py-3 px-4 shadow-sm">
          {{ team.name }}
        </span>
      </div>
    </section>

    <section v-if="loading" class="alert"><span>Chargement...</span></section>

    <section v-else class="flex flex-nowrap overflow-x-auto gap-8 pb-8 pt-4">
      <article
        v-for="(round, index) in rounds"
        :key="round.round"
        class="flex flex-col gap-6 justify-center min-w-[300px]"
      >
        <div class="text-center border-b-2 border-primary/20 pb-2">
          <h3 class="font-bold text-lg text-primary uppercase tracking-widest text-xs">
            Round {{ round.round }}
          </h3>
          <span v-if="index === rounds.length - 1 && round.matches.length === 1" class="badge badge-accent badge-sm mt-1 font-semibold shadow-sm">
            Finale
          </span>
        </div>

        <div class="flex flex-col gap-8 flex-1 justify-around">
          <div 
            v-for="match in round.matches" 
            :key="match.id" 
            class="relative group"
          >
            <!-- Ligne de droite (arbre) -->
            <div
              v-if="index < rounds.length - 1"
              class="absolute top-1/2 -right-4 w-4 border-t-2 border-base-300 z-0 transition-colors group-hover:border-primary"
            ></div>

            <!-- Ligne de gauche (arbre) -->
            <div
              v-if="index > 0"
              class="absolute top-1/2 -left-4 w-4 border-t-2 border-base-300 z-0 transition-colors group-hover:border-primary"
            ></div>

            <MatchCard
              :match="match"
              :teams="tournament?.teams || []"
              @edit-score="onOpenScoreModal"
              class="relative z-10 bg-base-100 shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20 rounded-box"
            />
          </div>
        </div>
      </article>

      <div v-if="!rounds.length" class="opacity-70 text-center w-full py-10 bg-base-100/50 rounded-box border border-dashed border-base-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-12 mx-auto text-base-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <p>Aucun match genere pour ce tournoi.</p>
        <p class="text-sm mt-1">N'oublie pas d'ajouter des participants et de generer le planning.</p>
      </div>
    </section>

    <AddTeamModal
      :open="addTeamModalOpen"
      :existing-names="allTeamNames"
      @close="addTeamModalOpen = false"
      @save="onAddTeam"
    />

    <ScoreModal
      :match="selectedMatch"
      :open="scoreModalOpen"
      @close="scoreModalOpen = false"
      @save="onSaveScore"
    />
  </main>
</template>
