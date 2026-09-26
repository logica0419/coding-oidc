<script setup lang="ts">
interface MeResponse {
  sub: string;
  name: string;
}

interface LoginResponse {
  authorizeUrl: string;
}

interface ExampleResponse {
  message: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 4: OIDC
const loadMe = async (): Promise<MeResponse> => {
  return getRequest<MeResponse>("/auth/me");
};

// TODO: Phase 1: OAuth
const callExample = async (): Promise<ExampleResponse> => {
  return getRequest<ExampleResponse>("http://localhost:3101/api/example");
};

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const startLogin = async (): Promise<LoginResponse> => {
  return getRequest<LoginResponse>("/auth/login");
};

const { data: me } = await useFetch<MeResponse>("/auth/me");
const exampleResult = ref("");
const onExample = async (): Promise<void> => {
  const result = await callExample();
  exampleResult.value = result.message;
};
const onLogin = async (): Promise<void> => {
  const result = await startLogin();
  redirectTo(result.authorizeUrl);
};
</script>

<template>
  <div>
    <h2>Relying Party</h2>
    <p>現在のユーザー: {{ me?.name }} ({{ me?.sub }})</p>
    <button type="button" @click="onExample">/api/example にアクセスする</button>
    <pre>{{ exampleResult }}</pre>
    <button type="button" @click="onLogin">opを使ってログインする</button>
  </div>
</template>
