<script setup lang="ts">
import { reactive } from 'vue';
import DiagramNode from '../DiagramNode.vue';

const form = reactive({
  name: '',
  reference: '',
});
</script>

<template>
  <DiagramNode
    title="Simple Task"
    subtitle="Transforms data and passes it along"
    accent="quaternary"
  >
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Task Name</span>
      <input
        v-model="form.name"
        class="neobrutalism-input"
        placeholder="Enter task name"
      />
    </label>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Reference Id</span>
      <input
        v-model="form.reference"
        class="neobrutalism-input"
        placeholder="Reference for downstream nodes"
      />
    </label>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button class="neobrutalism-button">Save</button>
        <button class="neobrutalism-button neobrutalism-secondary">Delete</button>
      </div>
    </template>
  </DiagramNode>
</template>
