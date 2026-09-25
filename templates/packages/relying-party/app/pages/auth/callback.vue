<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div>
    <h2>Callback</h2>
    <p>TODO: exchange code for tokens and show userinfo.</p>
    <pre>{{ route.query }}</pre>
  </div>
</template>
