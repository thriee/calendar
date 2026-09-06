<script setup lang="ts"></script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/">回到首页</router-link>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  text-align: center;
  padding: var(--space-6);
  h1 { font-size: 4rem; color: var(--color-primary); margin: 0; }
  a { color: var(--color-primary); }
}
</style>
