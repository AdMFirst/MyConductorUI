<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue'
import DiagramNode from '../DiagramNode.vue'

type HttpTaskData = {
  name: string
  reference: string
  url: string
  method: string
  body: string
}

const props = defineProps<{ value: HttpTaskData }>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'change', payload: HttpTaskData): void
}>()

const form = reactive<HttpTaskData>({
  name: '',
  reference: '',
  url: '',
  method: 'GET',
  body: '',
})

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
let syncing = false

const applyProps = (value: HttpTaskData) => {
  syncing = true
  form.name = value?.name ?? ''
  form.reference = value?.reference ?? ''
  form.url = value?.url ?? ''
  form.method = value?.method ?? 'GET'
  form.body = value?.body ?? ''

  nextTick(() => {
    syncing = false
  })
}

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
      }
    )
  },
  { deep: true, immediate: true }
)

watch(
  form,
  () => {
    if (syncing) return
    emit('change', {
      name: form.name,
      reference: form.reference,
      url: form.url,
      method: form.method,
      body: form.body,
    })
  },
  { deep: true }
)
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
