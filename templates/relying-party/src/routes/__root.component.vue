<script setup lang="ts">
import { HeadContent, Outlet, Scripts, Html, Body } from "@tanstack/vue-router";
import { ReturnType } from "node:ffi";
</script>

<template>
  <Html>
    <head>
      <HeadContent />
    </head>
    <Body>
      <header class="header">
        <h1>Relying Party (demo)</h1>
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
