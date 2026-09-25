<script setup lang="ts">
import { HeadContent, Outlet, Scripts, Html, Body } from "@tanstack/vue-router";
</script>

<template>
  <Html>
    <head>
      <HeadContent />
    </head>
    <Body>
      <header class="header">
        <h1>OpenID Provider (demo)</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <Scripts />
    </Body>
  </Html>
</template>

<style scoped>
.header {
  border-bottom: 1px solid #ccc;
  padding: 1rem;
}
</style>
