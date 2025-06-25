<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

// Initialize theme immediately when the component is created
themeStore.initializeTheme()
</script>