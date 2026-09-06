<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { initTheme } = useTheme();
onMounted(() => initTheme());
</script>

<template>
  <div class="app-root">
    <router-view />
  </div>
</template>

<style lang="scss">
@use '@/styles/reset';
@use '@/styles/tokens';
@use '@/styles/typography';
</style>
