<script setup lang="ts">
interface CodeResponse {
  message: string;
}

// TODO: Phase 1: OAuth
const exchangeCode = async (code: string, state: string): Promise<CodeResponse> => {
  return postRequest<CodeResponse>("/auth/code", { code, state });
};

const route = useRoute();
const result = ref("");
const onExchange = async (): Promise<void> => {
  const code = route.query.code;
  const state = route.query.state;
  if (typeof code !== "string" || typeof state !== "string") {
    return;
  }
  const response = await exchangeCode(code, state);
  result.value = response.message;
};
const goHome = (): void => {
  redirectTo("/");
};
</script>

<template>
  <div>
    <h2>OAuth/OIDC コールバックページ</h2>
    <button type="button" @click="onExchange">コードをトークンに交換する</button>
    <pre>{{ result }}</pre>
    <button type="button" @click="goHome">ホームに戻る</button>
  </div>
</template>
