<script setup lang="ts">
const { isAuthenticated } = useAuth();

if (isAuthenticated.value) {
  await navigateTo("/dashboard");
} else {
  await navigateTo("/register");
}
</script>

<template>
  <div />
</template>
