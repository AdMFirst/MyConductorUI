<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue';
import DiagramNode from '../DiagramNode.vue';

type SimpleTaskData = { name: string; reference: string };

const props = defineProps<{ value: SimpleTaskData }>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'change', payload: SimpleTaskData): void;
}>();

const form = reactive<SimpleTaskData>({
  name: '',
  reference: '',
});

let syncing = false;

const applyProps = (value: SimpleTaskData) => {
  syncing = true;
  form.name = value?.name ?? '';
  form.reference = value?.reference ?? '';
  nextTick(() => {
    syncing = false;
  });
};

// For receiving data from parents
// Since the 'real' data is saved on parents
watch(
  () => props.value,
  (value) => {
    applyProps(value ?? { name: '', reference: '' });
  },
  { deep: true, immediate: true }
);

// For sending data to parents
watch(
  form,
  () => {
    if (syncing) return;
    emit('change', { name: form.name, reference: form.reference });
  },
  { deep: true }
);
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
        <button
          type="button"
          class="neobrutalism-button neobrutalism-secondary"
          @click="emit('delete')"
        >
          Delete
        </button>
      </div>
    </template>
  </DiagramNode>
</template>
