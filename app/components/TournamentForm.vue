<script setup lang="ts">
const emit = defineEmits<{
  submit: [
    payload: {
      name: string;
      date: string;
      description?: string;
    },
  ];
}>();

const form = reactive({
  name: "",
  date: "",
  description: "",
});

function onSubmit() {
  emit("submit", {
    name: form.name,
    date: form.date,
    description: form.description || undefined,
  });

  form.name = "";
  form.date = "";
  form.description = "";
}
</script>

<template>
  <div class="card panel lift-on-hover enter-fade shadow-xl">
    <div class="card-body gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-secondary font-bold">
          Studio tournoi
        </p>
        <h2 class="card-title text-2xl display-title text-neutral mt-1">
          Creer un tournoi
        </h2>
      </div>

      <form class="grid gap-5" @submit.prevent="onSubmit">
        <label class="form-control">
          <span class="label-text font-medium mb-2 block">Nom</span>
          <input
            v-model="form.name"
            class="input input-bordered input-secondary bg-base-100/80"
            required
            minlength="2"
          />
        </label>

        <label class="form-control">
          <span class="label-text font-medium mb-2 block">Date</span>
          <input
            v-model="form.date"
            class="input input-bordered input-secondary bg-base-100/80"
            type="date"
            required
          />
        </label>

        <label class="form-control">
          <span class="label-text font-medium mb-2 block">Description</span>
          <textarea
            v-model="form.description"
            class="textarea textarea-bordered textarea-secondary bg-base-100/80"
            rows="3"
          />
        </label>

        <div class="card-actions justify-end pt-1">
          <button class="btn btn-primary px-8" type="submit">Creer</button>
        </div>
      </form>
    </div>
  </div>
</template>
