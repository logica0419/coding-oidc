<script setup lang="ts">
interface IndexInput {
  users: { id: string; name: string }[];
}

interface IndexOutput {
  example: string;
}

// TODO: Phase 1: OAuth
const loadUsers = async (): Promise<IndexInput> => {
  return getRequest<IndexInput>("/api/users");
};

// TODO: Phase 1: OAuth
const callExample = async (): Promise<IndexOutput> => {
  return getRequest<IndexOutput>("/api/example");
};

const { data: usersData } = await useFetch<IndexInput>("/api/users");
const exampleResult = ref("");
const callExampleButton = async (): Promise<void> => {
  const result = await callExample();
  exampleResult.value = result.example;
};
</script>

<template>
  <div>
    <h2>OpenID Provider</h2>
    <ul>
      <li v-for="user in usersData?.users ?? []" :key="user.id">{{ user.name }} ({{ user.id }})</li>
    </ul>
    <button type="button" @click="callExampleButton">/api/example にアクセスする</button>
    <pre>{{ exampleResult }}</pre>
  </div>
</template>
