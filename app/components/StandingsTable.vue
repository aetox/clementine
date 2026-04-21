<script setup lang="ts">
import type { StandingEntry } from "../../shared/types";

defineProps<{
  standings: StandingEntry[];
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-box border border-base-300 panel">
    <table class="table table-zebra table-sm md:table-md">
      <thead>
        <tr>
          <th>#</th>
          <th>Equipe</th>
          <th>Pts</th>
          <th>J</th>
          <th>V</th>
          <th>N</th>
          <th>D</th>
          <th>BP</th>
          <th>BC</th>
          <th>GA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!standings.length">
          <td colspan="10" class="text-center py-6 opacity-70">
            Aucun match joue pour le moment.
          </td>
        </tr>
        <tr v-for="(row, index) in standings" :key="row.teamId">
          <td>
            <span
              class="badge"
              :class="index === 0 ? 'badge-primary' : 'badge-ghost'"
            >
              {{ index + 1 }}
            </span>
          </td>
          <td>{{ row.teamName }}</td>
          <td class="font-bold">{{ row.points }}</td>
          <td>{{ row.played }}</td>
          <td>{{ row.wins }}</td>
          <td>{{ row.draws }}</td>
          <td>{{ row.losses }}</td>
          <td>{{ row.goalsFor }}</td>
          <td>{{ row.goalsAgainst }}</td>
          <td>{{ row.goalAverage }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
