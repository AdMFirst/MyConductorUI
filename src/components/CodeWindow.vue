<template>
  <div class="neobrutalism h-[95vh] w-full flex flex-col mx-3">
    <div class="p-4 border-b-2 border-black neobrutalism-primary">
      <h3 class="text-lg font-bold">Generated JSON</h3>
    </div>
    
    <div class="flex-1 p-4">
      <textarea
        class="neobrutalism-input w-full h-full resize-none"
        placeholder="Generated JSON code will appear here..."
        v-model="jsonContent"
        readonly
      ></textarea>
    </div>
    
    <div class="p-4 border-t-2 border-black flex justify-between items-center">
      <span class="text-sm text-black">Characters: {{ jsonContent.length }}</span>
      <div class="flex gap-2">
        <button
          class="neobrutalism-button neobrutalism-primary"
          @click="copyToClipboard"
        >
          Copy JSON
        </button>
        <button
          class="neobrutalism-button neobrutalism-secondary"
          @click="clearBoard"
        >
          Clear Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const jsonContent = ref(`{
  "workflow": {
    "nodes": [
      {
        "id": "1",
        "type": "simple",
        "position": { "x": 100, "y": 100 },
        "data": { "label": "Start Node" }
      }
    ],
    "edges": []
  }
}`);

const copyToClipboard = () => {
  navigator.clipboard.writeText(jsonContent.value);
  alert('JSON copied to clipboard!');
};

const clearBoard = () => {
    jsonContent.value = '';
}
</script>