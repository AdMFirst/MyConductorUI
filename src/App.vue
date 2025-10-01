<script setup lang="ts">
import CodeWindow from './components/CodeWindow.vue';
</script>

<template>
  <div class="min-h-dvh relative flex">
    <div class="w-3/5">
      <!-- Content for editing layer will go here -->
    </div>

    <!-- This will be the code layer  -->
    <div class="w-2/5 flex items-center justify-center">
      <CodeWindow />
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
</style>
