<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue';
import DiagramNode from '../DiagramNode.vue';

type InlineTaskData = { name: string; reference: string; code: string };

const props = defineProps<{ value: InlineTaskData }>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'change', payload: InlineTaskData): void;
}>();

const form = reactive<InlineTaskData>({
  name: '',
  reference: '',
  code: '',
});

let syncing = false;

const applyProps = (value: InlineTaskData) => {
  syncing = true;
  form.name = value?.name ?? '';
  form.reference = value?.reference ?? '';
  form.code = value?.code ?? '';
  nextTick(() => {
    syncing = false;
  });
};

// For receiving data from parents
// Since the 'real' data is saved on parents
watch(
  () => props.value,
  (value) => {
    applyProps(value ?? { name: '', reference: '', code: '' });
  },
  { deep: true, immediate: true }
);

// For sending data to parents
watch(
  form,
  () => {
    if (syncing) return;
    emit('change', { name: form.name, reference: form.reference, code: form.code });
  },
  { deep: true }
);
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
