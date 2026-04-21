<script setup lang="ts">
const { login } = useAuth();
const email = ref("");
const password = ref("");
const errorMsg = ref("");

async function onSubmit() {
  errorMsg.value = "";
  try {
    await login({ email: email.value, password: password.value });
    navigateTo("/dashboard");
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || err.message || "Failed to login";
  }
}
</script>

<template>
  <main class="max-w-sm mx-auto mt-10 space-y-5">
    <section class="panel rounded-box p-6 space-y-4">
      <h2 class="text-2xl font-bold">Connexion</h2>
      <div v-if="errorMsg" class="alert alert-error">{{ errorMsg }}</div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <label class="form-control">
          <div class="label"><span class="label-text">Email</span></div>
          <input v-model="email" type="email" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <div class="label"><span class="label-text">Mot de passe</span></div>
          <input v-model="password" type="password" class="input input-bordered" required />
        </label>
        <button type="submit" class="btn btn-primary w-full text-white">Se connecter</button>
      </form>
      <p class="text-sm text-center">Pas encore de compte ? <NuxtLink to="/register" class="link text-primary">S'inscrire</NuxtLink></p>
    </section>
  </main>
</template>