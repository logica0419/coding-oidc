<script setup lang="ts">
const { data } = await useFetch<StatusResponse>("/api/status");
</script>

<template>
  <div>
    <h2>Relying Party</h2>
    <p>TODO: login button that starts the authorization code flow with PKCE.</p>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.25rem;
}
</style>
