<template>
  <div>
    <header>
      <h1>Relying Party (demo)</h1>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
header {
  --header-background: hsl(0, 70%, 38%);
  --header-foreground: #fff;
  background: var(--header-background);
  color: var(--header-foreground);
  padding: 24px 16px;

  & h1 {
    color: var(--header-foreground);
  }
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
}
</style>
