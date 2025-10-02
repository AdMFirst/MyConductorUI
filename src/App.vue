<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue'

import CodeWindow from './components/CodeWindow.vue'
import Edge from './components/Edge.vue'
import HttpNode from './components/NodeTypes/HttpNode.vue'
import InlineNode from './components/NodeTypes/InlineNode.vue'
import SimpleNode from './components/NodeTypes/SimpleNode.vue'
import StaticNode from './components/NodeTypes/StaticNode.vue'
import axios from 'axios'

const nodeComponentMap: Record<string, any> = {
  http: HttpNode,
  inline: InlineNode,
  simple: SimpleNode,
}

const nodes = ref<any[]>([])
const generatedJson = ref('')
const isProcessing = ref(false)
let processTimer: number | null = null

const DEFAULT_METHOD = 'GET'
const PROCESS_DEBOUNCE_MS = 800

const WORKFLOW_DESCRIPTION = 'A workflow generated with MyConductorUI'
const WORKFLOW_VERSION = 1
const WORKFLOW_SCHEMA_VERSION = 2
const WORKFLOW_NAME_PREFIX = 'myconductorui-generated'

const API_BASE = import.meta.env.VITE_API_BASE ?? ""

const workflowName = ref(makeWorkflowName())

type ConductorTask = { [key: string]: unknown }

function makeWorkflowName() {
  const id =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `${WORKFLOW_NAME_PREFIX}-${id}`
}

function makeNode(type: string) {
  if (type === 'simple') {
    return { type, data: { name: '', reference: '' } }
  }
  if (type === 'inline') {
    return { type, data: { name: '', reference: '', code: '' } }
  }
  if (type === 'http') {
    return {
      type,
      data: {
        name: '',
        reference: '',
        url: '',
        method: DEFAULT_METHOD,
        body: '',
      },
    }
  }
  return { type, data: {} }
}

const parseBodyValue = (payload: string): unknown | undefined => {
  const trimmed = payload?.trim()
  if (!trimmed) return undefined
  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

function buildTask(node: any, index: number): ConductorTask | null {
  const name = (node?.data?.name ?? '').trim() || `Step ${index + 1}`
  const reference = (node?.data?.reference ?? '').trim() || `task${index + 1}`

  if (node.type === 'http') {
    const httpRequest: Record<string, unknown> = {
      uri: (node?.data?.url ?? '').trim(),
      method: (node?.data?.method ?? DEFAULT_METHOD).toUpperCase(),
    }
    const bodyValue = parseBodyValue(node?.data?.body ?? '')
    if (bodyValue !== undefined) httpRequest.body = bodyValue

    return {
      name,
      taskReferenceName: reference,
      type: 'HTTP',
      inputParameters: { http_request: httpRequest },
    }
  }

  if (node.type === 'inline') {
    return {
      name,
      taskReferenceName: reference,
      type: 'INLINE',
      scriptExpression: node?.data?.code ?? 'return \'hello world!\'' ,
    }
  }

  if (node.type === 'simple') {
    return {
      name,
      taskReferenceName: reference,
      type: 'SIMPLE',
      inputParameters: {},
    }
  }

  return null
}

function buildWorkflow() {
  const tasks = nodes.value
    .map((node, index) => buildTask(node, index))
    .filter((task): task is ConductorTask => Boolean(task))

  return {
    name: workflowName.value,
    version: WORKFLOW_VERSION,
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    description: WORKFLOW_DESCRIPTION,
    inputParameters: [],
    tasks,
  }
}

async function processWorkflow() {
  if (nodes.value.length < 1 ){
    return
  }

  isProcessing.value = true

  var result = await axios.put(
    API_BASE+"/api/metadata/workflow", 
    JSON.stringify([buildWorkflow()], null, 2),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (result.status != 200) {
    console.error(result.data)
    generatedJson.value = "Something went wrong please try again later..."
    isProcessing.value = false
    return
  }

  var realJson = await axios.get(API_BASE+"/api/metadata/workflow/"+workflowName.value)

  if (realJson.status != 200) {
    console.error(result.data)
    generatedJson.value = "Something went wrong please try again later..."
    isProcessing.value = false
    return
  }

  generatedJson.value = JSON.stringify(realJson.data, null, 2);
  isProcessing.value = false
}

function scheduleProcess() {
  if (processTimer !== null) clearTimeout(processTimer)
  processTimer = window.setTimeout(() => {
    processTimer = null
    processWorkflow()
  }, PROCESS_DEBOUNCE_MS)
}

function handleAddNode({ position, type }: any) {
  if (position < 0) position = 0
  if (position > nodes.value.length) position = nodes.value.length
  nodes.value.splice(position, 0, makeNode(type))
  processWorkflow()
}

function handleDeleteNode(index: number) {
  nodes.value.splice(index, 1)
  processWorkflow()
}

function handleNodeChange(index: number, data: any) {
  const node = nodes.value[index]
  if (!node) return
  node.data = JSON.parse(JSON.stringify(data))
  scheduleProcess()
}

async function handleResetWorkflow() {
  generatedJson.value = ''
  isProcessing.value = false
  nodes.value = []
  workflowName.value = makeWorkflowName()
  await nextTick()
  processWorkflow()
}

onBeforeUnmount(() => {
  if (processTimer !== null) clearTimeout(processTimer)
})

processWorkflow()
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-dvh">
    <!-- Left workflow graph -->
    <div class="w-full md:w-3/5 h-auto md:h-dvh p-4 overflow-y-auto scroll-hidden">
      <StaticNode type="start" />
      <Edge :position="0" @add-node="handleAddNode" />

      <div v-for="(node, i) in nodes" :key="i" class="flex flex-col">
        <component
          :is="nodeComponentMap[node.type]"
          :value="node.data"
          @change="handleNodeChange(i, $event)"
          @delete="handleDeleteNode(i)"
        />
        <Edge :position="i + 1" @add-node="handleAddNode" />
      </div>

      <StaticNode type="end" />
    </div>

    <!-- Right JSON preview -->
    <div class="w-full md:w-2/5 p-4 h-dvh flex-1 flex items-start md:items-center justify-center overflow-y-auto">
      <CodeWindow
        :code="generatedJson"
        :is-processing="isProcessing"
        @reset="handleResetWorkflow"
      />
    </div>
  </div>
</template>



<style scoped>
.scroll-hidden {
  scrollbar-width: none;
}
.scroll-hidden::-webkit-scrollbar {
  display: none;
}
</style>

