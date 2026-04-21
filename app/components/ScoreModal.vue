<script setup lang="ts">
import type { MatchDTO } from "../../shared/types";

const props = defineProps<{
  match: MatchDTO | null;
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  save: [payload: { matchId: number; homeScore: number; awayScore: number }];
}>();

const homeScore = ref(0);
const awayScore = ref(0);

watch(
  () => props.match,
  (match) => {
    homeScore.value = match?.homeScore ?? 0;
    awayScore.value = match?.awayScore ?? 0;
  },
  { immediate: true },
);

function save() {
  if (!props.match) {
    return;
  }

  emit("save", {
    matchId: props.match.id,
    homeScore: homeScore.value,
    awayScore: awayScore.value,
  });
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': open }">
    <div class="modal-box panel border border-base-300 shadow-2xl">
      <p class="text-xs uppercase tracking-[0.25em] text-secondary font-bold">
        Resultat
      </p>
      <h3 class="font-bold text-2xl display-title text-neutral mt-1">
        Saisir le score
      </h3>

      <div class="grid grid-cols-2 gap-3 mt-4">
        <label class="form-control">
          <span class="label-text font-medium">Domicile</span>
          <input
            v-model.number="homeScore"
            class="input input-bordered input-secondary"
            type="number"
            min="0"
          />
        </label>
        <label class="form-control">
          <span class="label-text font-medium">Exterieur</span>
          <input
            v-model.number="awayScore"
            class="input input-bordered input-secondary"
            type="number"
            min="0"
          />
        </label>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="emit('close')">Annuler</button>
        <button class="btn btn-primary" @click="save">Enregistrer</button>
      </div>
    </div>
  </dialog>
</template>
