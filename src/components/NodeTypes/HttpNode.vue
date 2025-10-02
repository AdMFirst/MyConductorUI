<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import DiagramNode from '../DiagramNode.vue';

type HttpTaskData = {
  name: string;
  reference: string;
  url: string;
  method: string;
  body: string;
  headers: Array<{ key: string; value: string }>;
};

type HeaderRow = { id: number; key: string; value: string };

const props = defineProps<{ value: HttpTaskData }>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'change', payload: HttpTaskData): void;
}>();

const form = reactive({
  name: '',
  reference: '',
  url: '',
  method: 'GET',
  body: '',
});

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const headers = ref<HeaderRow[]>([{ id: 1, key: '', value: '' }]);
let headerId = 1;
let syncing = false;

const ensureHeaderRows = (items: Array<{ key: string; value: string }>): HeaderRow[] => {
  if (!items.length) {
    headerId = 1;
    return [{ id: headerId, key: '', value: '' }];
  }

  return items.map((item, index) => ({
    id: index + 1,
    key: item.key,
    value: item.value,
  }));
};

const applyProps = (value: HttpTaskData) => {
  syncing = true;
  form.name = value?.name ?? '';
  form.reference = value?.reference ?? '';
  form.url = value?.url ?? '';
  form.method = value?.method ?? 'GET';
  form.body = value?.body ?? '';

  const nextHeaders = ensureHeaderRows(value?.headers ?? []);
  headers.value = nextHeaders;
  headerId = headers.value.reduce((max, item) => Math.max(max, item.id), 0) || 1;

  nextTick(() => {
    syncing = false;
  });
};

// For receiving data from parents
// Since the 'real' data is saved on parents
watch(
  () => props.value,
  (value) => {
    applyProps(
      value ?? {
        name: '',
        reference: '',
        url: '',
        method: 'GET',
        body: '',
        headers: [],
      }
    );
  },
  { deep: true, immediate: true }
);

// For sending data to parents
const emitSnapshot = () => {
  if (syncing) return;
  emit('change', {
    name: form.name,
    reference: form.reference,
    url: form.url,
    method: form.method,
    body: form.body,
    headers: headers.value.map(({ key, value }) => ({ key, value })),
  });
};

// Trigger sending data to parents everytime form or headers changed
watch(form, emitSnapshot, { deep: true });
watch(headers, emitSnapshot, { deep: true });

const addHeader = () => {
  headerId += 1;
  headers.value.push({ id: headerId, key: '', value: '' });
};

const removeHeader = (id: number) => {
  if (headers.value.length === 1) return;
  headers.value = headers.value.filter((h) => h.id !== id);
};
</script>

<template>
  <DiagramNode
    title="HTTP Request"
    subtitle="Calls an external REST endpoint"
    accent="quinary"
  >
    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Task Name</span>
      <input
        v-model="form.name"
        class="neobrutalism-input"
        placeholder="Fetch customer data"
      />
    </label>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">Reference Id</span>
      <input
        v-model="form.reference"
        class="neobrutalism-input"
        placeholder="customers.fetch"
      />
    </label>

    <div class="grid gap-3 sm:grid-cols-[auto,1fr]">
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-semibold text-[var(--nb-black)]">Method</span>
        <select v-model="form.method" class="neobrutalism-input">
          <option v-for="method in methods" :key="method">{{ method }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-semibold text-[var(--nb-black)]">URL</span>
        <input
          v-model="form.url"
          class="neobrutalism-input"
          placeholder="https://api.example.com/customers"
        />
      </label>
    </div>

    <section class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <span class="font-semibold text-[var(--nb-black)]">Headers</span>
        <button class="neobrutalism-button" type="button" @click="addHeader">+ Header</button>
      </div>
      <div
        v-for="header in headers"
        :key="header.id"
        class="grid gap-2 sm:grid-cols-[1fr,1fr,auto]"
      >
        <input
          v-model="header.key"
          class="neobrutalism-input"
          placeholder="Authorization"
        />
        <input
          v-model="header.value"
          class="neobrutalism-input"
          placeholder="Bearer token"
        />
        <button
          class="neobrutalism-button bg-[var(--nb-black)] text-[var(--nb-white)] hover:bg-[var(--nb-black)] disabled:opacity-60 disabled:cursor-not-allowed"
          type="button"
          @click="removeHeader(header.id)"
          :disabled="headers.length === 1"
        >
          Remove
        </button>
      </div>
    </section>

    <label class="flex flex-col gap-1 text-sm">
      <span class="font-semibold text-[var(--nb-black)]">JSON Body</span>
      <textarea
        v-model="form.body"
        class="neobrutalism-input min-h-[120px] font-mono text-sm leading-relaxed"
        spellcheck="false"
        placeholder='{"status": "active"}'
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
