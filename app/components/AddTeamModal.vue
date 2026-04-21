<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  open: boolean;
  existingNames: string[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", name: string): void;
}>();

const name = ref("");

function onSubmit() {
  if (!name.value.trim()) return;
  emit("save", name.value.trim());
  name.value = "";
}

function onClose() {
  name.value = "";
  emit("close");
}

const filteredNames = computed(() => {
  if (!name.value.trim()) return [];
  const search = name.value.toLowerCase();
  return props.existingNames
    .filter(
      (n) => n.toLowerCase().includes(search) && n.toLowerCase() !== search,
    )
    .slice(0, 5);
});

function selectName(val: string) {
  name.value = val;
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': open }">
    <div class="modal-box panel relative overflow-visible">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="onClose"
        >
          ✕
        </button>
      </form>
      <h3
        class="font-bold text-xl text-primary-content bg-primary -mx-6 -mt-6 p-4 rounded-t-box flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Ajouter une équipe
      </h3>

      <form @submit.prevent="onSubmit" class="mt-6 flex flex-col gap-4">
        <div class="form-control relative">
          <label class="label">
            <span class="label-text font-semibold">Nom de l'équipe</span>
          </label>
          <input
            v-model="name"
            class="input input-bordered input-primary w-full"
            placeholder="Saisissez ou cherchez un nom..."
            autofocus
            autocomplete="off"
            required
          />

          <!-- Dropdown d'autocomplétion -->
          <ul
            v-if="filteredNames.length > 0"
            class="menu bg-base-100 w-full rounded-box border border-base-300 shadow-xl absolute z-50 top-[88px]"
          >
            <li v-for="suggestion in filteredNames" :key="suggestion">
              <button type="button" @click="selectName(suggestion)">
                {{ suggestion }}
              </button>
            </li>
          </ul>
        </div>

        <div class="modal-action mt-2">
          <button type="button" class="btn btn-ghost" @click="onClose">
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary shadow-sm"
            :disabled="!name.trim()"
          >
            Valider
          </button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="onClose">Fermer</button>
    </form>
  </dialog>
</template>
