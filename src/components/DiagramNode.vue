<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = defineProps<{
  title: string;
  subtitle?: string;
  accent?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'neutral';
  status?: 'start' | 'end' | 'default';
}>();

const slots = useSlots();

const accentClass = computed(() => {
  switch (props.accent) {
    case 'primary':
      return 'neobrutalism-primary';
    case 'secondary':
      return 'neobrutalism-secondary';
    case 'tertiary':
      return 'neobrutalism-tertiary';
    case 'quaternary':
      return 'neobrutalism-quaternary';
    case 'quinary':
      return 'neobrutalism-quinary';
    default:
      return '';
  }
});
</script>

<template>
  <article class="neobrutalism relative mx-auto w-[min(360px,90%)] overflow-hidden bg-[var(--nb-white)]">
    <header :class="['flex items-center justify-between gap-4 border-b-2 border-[var(--nb-black)] px-5 py-4', accentClass]">
      <div class="flex items-center gap-3">
        <div>
          <h3 class="m-0 text-lg font-bold text-[var(--nb-black)]">{{ title }}</h3>
          <p v-if="subtitle" class="mt-0.5 text-xs text-[var(--nb-black)] font-semibold">{{ subtitle }}</p>
        </div>
      </div>
    </header>

    <section class="flex flex-col gap-3 bg-[var(--nb-white)] p-5">
      <slot />
    </section>

    <footer v-if="slots.footer" class="border-t-2 border-[var(--nb-black)] bg-[var(--nb-white)] px-5 py-4">
      <slot name="footer" />
    </footer>
  </article>
</template>
