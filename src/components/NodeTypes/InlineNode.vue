<script setup lang="ts">
import { reactive } from 'vue';
import DiagramNode from '../DiagramNode.vue';

const form = reactive({
  name: '',
  reference: '',
  code: ''
});
</script>

<template>
  <DiagramNode
    title="Inline Script"
    subtitle="Run custom JavaScript inside the workflow"
    accent="tertiary"
  >
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Display Name</span>
      <input
        v-model="form.name"
        class="neobrutalism-input"
        placeholder="Give this step a friendly label"
      />
    </label>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Reference Id</span>
      <input
        v-model="form.reference"
        class="neobrutalism-input"
        placeholder="Used by later nodes to access results"
      />
    </label>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">JavaScript Code</span>
      <textarea
        v-model="form.code"
        class="neobrutalism-input min-h-[140px] font-mono text-sm leading-relaxed"
        spellcheck="false"
        placeholder="return { status: 'ok' };"
      ></textarea>
    </label>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button class="neobrutalism-button">Save</button>
        <button class="neobrutalism-button neobrutalism-secondary">Delete</button>
      </div>
    </template>
  </DiagramNode>
</template>
