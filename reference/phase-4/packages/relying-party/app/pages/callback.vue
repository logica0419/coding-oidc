<script setup lang="ts">
// TODO: Phase 1: OAuth
const exchangeCode = async (code: string, state: string): Promise<ExchangeResponse> => {
  return postRequest<ExchangeResponse>("/exchange", { code, state });
};

const route = useRoute();
const result = ref("");
const errorMessage = ref("");

const onExchange = async (): Promise<void> => {
  const code = route.query.code;
  const state = route.query.state;

  if (typeof code !== "string" || typeof state !== "string") {
    return;
  }

  try {
    const response = await exchangeCode(code, state);
    result.value = response.message;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "exchange failed";
  }
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
    <p v-if="errorMessage !== ''">{{ errorMessage }}</p>
    <button type="button" @click="goHome">ホームに戻る</button>
  </div>
</template>
