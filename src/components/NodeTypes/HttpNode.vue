<script setup lang="ts">
import { reactive, ref } from 'vue';
import DiagramNode from '../DiagramNode.vue';

const form = reactive({
  name: '',
  reference: '',
  url: '',
  method: 'GET',
  body: ''
});

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const headers = ref([
  { id: 1, key: '', value: '' }
]);

let headerId = 1;

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
        <button class="neobrutalism-button">Save</button>
        <button class="neobrutalism-button neobrutalism-secondary">Delete</button>
      </div>
    </template>
  </DiagramNode>
</template>
