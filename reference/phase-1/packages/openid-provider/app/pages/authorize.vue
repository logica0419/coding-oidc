<script setup lang="ts">
interface ConsentInput {
  responseType: string;
  clientId: string;
  scope: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};

const route = useRoute();
const { data: usersData } = await useFetch<UsersResponse>("/api/users");
const errorMessage = ref("");

const input: ConsentInput = {
  responseType: pickString(route.query, "response_type"),
  clientId: pickString(route.query, "client_id"),
  scope: pickString(route.query, "scope"),
  state: pickString(route.query, "state"),
  codeChallenge: pickString(route.query, "code_challenge"),
  codeChallengeMethod: pickString(route.query, "code_challenge_method"),
};

const onClick = async (userId: string): Promise<void> => {
  try {
    await grantAccess(userId, input);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "consent failed";
  }
};
</script>

<template>
  <div>
    <h2>OAuth/OIDC 認可ページ</h2>
    <p v-if="errorMessage !== ''">{{ errorMessage }}</p>
    <ul>
      <li v-for="user in usersData ?? []" :key="user.id">
        {{ user.name }} ({{ user.id }})
        <button type="button" @click="() => onClick(user.id)">許可する</button>
      </li>
    </ul>
  </div>
</template>
