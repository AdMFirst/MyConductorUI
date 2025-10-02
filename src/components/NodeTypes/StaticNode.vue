<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ type: 'start' | 'end' }>();

const label = computed(() => (props.type === 'start' ? 'Start' : 'Stop'));

const wrapperClasses = computed(() => {
  const base = 'neobrutalism mx-auto flex h-16 w-32 items-center justify-center rounded-md text-lg font-extrabold uppercase tracking-wider';
  const palette = props.type === 'start' ? 'neobrutalism-primary' : 'neobrutalism-secondary';
  return `${base} ${palette}`;
});
</script>

<template>
  <div :class="wrapperClasses" :data-node-type="props.type">
    <span>{{ label }}</span>
  </div>
</template>
