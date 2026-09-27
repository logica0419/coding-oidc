<script setup lang="ts">
const { data: usersData } = await useFetch<UsersResponse>("/api/users");
const exampleResult = ref("");
const exampleError = ref("");

const exampleButton = async (): Promise<void> => {
  exampleError.value = "";

  try {
    const result = await getRequest<ExampleResponse>("/api/example");
    exampleResult.value = result.message;
  } catch (error) {
    exampleError.value = error instanceof Error ? error.message : "example failed";
  }
};
</script>

<template>
  <div>
    <h2>OpenID Provider</h2>
    <ul>
      <li v-for="user in usersData ?? []" :key="user.id">{{ user.name }} ({{ user.id }})</li>
    </ul>
    <button type="button" @click="exampleButton">/api/example にアクセスする</button>
    <pre>{{ exampleResult }}</pre>
    <p v-if="exampleError !== ''">{{ exampleError }}</p>
  </div>
</template>
