<script setup lang="ts">
const { data } = await useFetch<StatusResponse>("/api/status");
</script>

<template>
  <div>
    <h2>OpenID Provider</h2>
    <p>This is a demo OP. TODO: consent screen with user selection.</p>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.25rem;
}
</style>
