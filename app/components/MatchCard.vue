<script setup lang="ts">
import type { MatchDTO, TeamDTO } from "../../shared/types";

const props = defineProps<{
  match: MatchDTO;
  teams: TeamDTO[];
}>();

const emit = defineEmits<{
  editScore: [match: MatchDTO];
}>();

const teamMap = computed(() => {
  return new Map(props.teams.map((team) => [team.id, team.name]));
});

const homeName = computed(
  () => teamMap.value.get(props.match.homeTeamId) ?? "Equipe inconnue",
);
const awayName = computed(
  () => teamMap.value.get(props.match.awayTeamId) ?? "Equipe inconnue",
);
</script>

<template>
  <div class="card panel lift-on-hover shadow-sm">
    <div class="card-body py-4 gap-3">
      <div class="flex items-center justify-between gap-2">
        <p class="text-xs uppercase tracking-[0.18em] font-bold text-secondary">
          Round {{ match.round }}
        </p>
        <button
          class="btn btn-xs btn-outline btn-secondary"
          @click="emit('editScore', match)"
        >
          {{ match.played ? "Modifier score" : "Saisir score" }}
        </button>
      </div>

      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <p class="font-semibold text-base-content/90">{{ homeName }}</p>
        <p class="badge badge-neutral badge-lg px-4 py-3 font-bold text-base">
          {{ match.homeScore ?? "-" }} : {{ match.awayScore ?? "-" }}
        </p>
        <p class="font-semibold text-base-content/90">{{ awayName }}</p>
      </div>

      <p class="text-xs opacity-70 text-center">
        {{ match.played ? "Match valide" : "En attente du score" }}
      </p>
    </div>
  </div>
</template>
