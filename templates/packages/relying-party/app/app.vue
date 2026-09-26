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

<style>
body {
  margin: 0;
  font-family: sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  background: hsl(0, 70%, 92%);
  text-align: center;
}

h1,
h2,
h3 {
  margin: 0;
  font-weight: 700;
}

h1 {
  font-size: 36px;
  line-height: 1.4;
}

h2 {
  font-size: 28px;
  line-height: 1.5;
}

h3 {
  font-size: 22px;
  line-height: 1.6;
}

a {
  color: hsl(0, 70%, 38%);
}
</style>

<style scoped>
header {
  background: hsl(0, 70%, 38%);
  color: #fff;
  padding: 24px 16px;
}

header h1 {
  color: #fff;
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 16px;
}
</style>
