<script setup lang="ts">
interface AuthorizePageInput {
  users: { id: string; name: string }[];
  input: {
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
    codeChallenge: string;
    codeChallengeMethod: string;
  };
}

interface ConsentOutput {
  redirectTo: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const allowUser = async (userId: string, pageInput: AuthorizePageInput): Promise<ConsentOutput> => {
  return postRequest<ConsentOutput>("/consent", {
    client_id: pageInput.input.clientId,
    redirect_uri: pageInput.input.redirectUri,
    scope: pageInput.input.scope,
    state: pageInput.input.state,
    code_challenge: pageInput.input.codeChallenge,
    code_challenge_method: pageInput.input.codeChallengeMethod,
    user_id: userId,
  });
};

const route = useRoute();
const { data } = await useFetch<AuthorizePageInput>("/authorize", { query: route.query });
const allow = async (userId: string): Promise<void> => {
  if (data.value === null || data.value === undefined) {
    return;
  }
  const result = await allowUser(userId, data.value);
  redirectTo(result.redirectTo);
};
</script>

<template>
  <div>
    <h2>OAuth/OIDC 認可ページ</h2>
    <ul>
      <li v-for="user in data?.users ?? []" :key="user.id">
        {{ user.name }} ({{ user.id }})
        <button type="button" @click="() => allow(user.id)">許可する</button>
      </li>
    </ul>
  </div>
</template>
