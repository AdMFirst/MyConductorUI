<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<template>
  <div class="neobrutalism h-full w-full flex flex-col">
    <div class="p-4 border-b-2 border-black rounded-t-md neobrutalism-primary flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold">MyConductorUI</h1>
        <h2 class="text-sm">Create conductor scripts with a simple ui</h2>
      </div>
      <span v-if="isProcessing" class="text-xs font-semibold uppercase tracking-wide">Processing...</span>
    </div>
    
    <div class="flex-1 p-4">
      <textarea
        class="neobrutalism-input w-full h-full min-h-[200px] resize-none"
        :placeholder="placeholder"
        :value="code"
        readonly
      ></textarea>
    </div>
    
    <div class="p-4 border-t-2 border-black flex justify-between items-center">
      <span class="text-sm text-black">Characters: {{ characterCount }}</span>
      <div class="flex gap-2">
        <button
          class="neobrutalism-button neobrutalism-primary"
          type="button"
          :disabled="!code"
          @click="copyToClipboard"
        >
          Copy JSON
        </button>
        <button
          class="neobrutalism-button neobrutalism-secondary"
          type="button"
          @click="clearBoard"
        >
          Clear Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  code: string;
  isProcessing: boolean;
}>();

const emit = defineEmits<{ (e: 'reset'): void }>();

const characterCount = computed(() => props.code.length);
const placeholder = computed(() =>
  props.isProcessing
    ? 'Generating workflow JSON (mock)...'
    : 'Generated JSON code will appear here...'
);

const copyToClipboard = () => {
  if (!props.code) return;
  navigator.clipboard.writeText(props.code);
  alert('JSON copied to clipboard!');
};

const clearBoard = () => {
  emit('reset');
};
</script>
