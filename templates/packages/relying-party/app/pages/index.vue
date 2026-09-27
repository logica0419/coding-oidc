<script setup lang="ts">
// TODO: Phase 1: OAuth
const startLogin = async (): Promise<void> => {
  return;
};

const exampleResult = ref("");
const exampleError = ref("");
const onExample = async (): Promise<void> => {
  exampleError.value = "";

  try {
    const result = await getRequest<ExampleResponse>("/example");
    exampleResult.value = result.message;
  } catch (error) {
    exampleError.value = error instanceof Error ? error.message : "example failed";
  }
};

const onLogin = async (): Promise<void> => {
  await startLogin();
};
</script>

<template>
  <div>
    <h2>Relying Party</h2>
    <button type="button" @click="onExample">/api/example にアクセスする</button>
    <pre>{{ exampleResult }}</pre>
    <p v-if="exampleError !== ''">{{ exampleError }}</p>
    <button type="button" @click="onLogin">opを使ってログインする</button>
  </div>
</template>
