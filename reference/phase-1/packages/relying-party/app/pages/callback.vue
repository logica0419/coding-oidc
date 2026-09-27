<script setup lang="ts">
// TODO: Phase 1: OAuth
const exchangeCode = async (code: string): Promise<ExchangeResponse> => {
  return postRequest<ExchangeResponse>("/exchange", { code });
};

const route = useRoute();
const result = ref("");
const errorMessage = ref("");

const onExchange = async (): Promise<void> => {
  const code = route.query.code;

  if (typeof code !== "string") {
    return;
  }

  try {
    const response = await exchangeCode(code);
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
