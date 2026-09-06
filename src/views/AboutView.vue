<script setup lang="ts"></script>

<template>
  <div class="about">
    <h1>关于万年历</h1>
    <p>一个简洁实用的万年历 Web 应用，支持农历、节气、传统节日与中国法定节假日。</p>
    <p>技术栈：Vue 3 + Vite + TypeScript + lunar-javascript</p>
    <router-link to="/">← 返回日历</router-link>
  </div>
</template>

<style lang="scss" scoped>
.about {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--space-5);
  line-height: 1.8;

  h1 { color: var(--color-primary); }
  a { color: var(--color-primary); }
}
</style>
