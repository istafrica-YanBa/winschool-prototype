<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
    <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
      <thead class="bg-slate-50 dark:bg-slate-800">
        <slot name="header" />
      </thead>
      <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
        <slot name="body" />
      </tbody>
      <tfoot v-if="$slots.footer" class="bg-slate-50 dark:bg-slate-800">
        <slot name="footer" />
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
// This is a simple table wrapper component
// Styling is handled through CSS classes
</script>

<style scoped>
thead th {
  @apply px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400;
}

tbody td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100;
}

tfoot td {
  @apply px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400;
}
</style> 