<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue'
import CodeWindow from './components/CodeWindow.vue'
import Edge from './components/Edge.vue'
import HttpNode from './components/NodeTypes/HttpNode.vue'
import InlineNode from './components/NodeTypes/InlineNode.vue'
import SimpleNode from './components/NodeTypes/SimpleNode.vue'
import StaticNode from './components/NodeTypes/StaticNode.vue'

// map node type -> component
const nodeComponentMap: any = {
  http: HttpNode,
  inline: InlineNode,
  simple: SimpleNode
}

// state
const nodes = ref<any[]>([])
const generatedJson = ref('')
const isProcessing = ref(false)
let processTimer: number | null = null

// defaults
const DEFAULT_METHOD = 'GET'
const DEFAULT_HEADERS = [{ key: '', value: '' }]
const PROCESS_DEBOUNCE_MS = 600 

// create node with default data
function makeNode(type: string) {
  let data: any = {}
  if (type === 'simple') {
    data = { name: '', reference: '' }
  } else if (type === 'inline') {
    data = { name: '', reference: '', code: '' }
  } else if (type === 'http') {
    data = { name: '', reference: '', url: '', method: DEFAULT_METHOD, body: '', headers: [...DEFAULT_HEADERS] }
  }
  return { type, data }
}

// build workflow JSON
async function processWorkflow() {
  var createdAt = localStorage.getItem('creation-time');
  if (!createdAt){
    createdAt = new Date().toISOString();
    localStorage.setItem('creation-time', createdAt);
  }

  isProcessing.value = true
  await new Promise(r => setTimeout(r, 8000)) // fake delay
  const workflow: any = {
    nodes: [
      ...nodes.value.map((n, i) => ({ id: i, type: n.type, order: i + 1, config: n.data })),
    ],
    summary: {
      totalSteps: nodes.value.length,
      createdAt: createdAt,
      lastUpdated: new Date().toISOString()
    }
  }
  generatedJson.value = JSON.stringify({ workflow }, null, 2)
  isProcessing.value = false
}

// Schedule the workflow
function scheduleProcess() {
  if (processTimer !== null) clearTimeout(processTimer)
  processTimer = window.setTimeout(() => {
    processTimer = null
    processWorkflow()
  }, PROCESS_DEBOUNCE_MS)
}

// handlers
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
  node.data = JSON.parse(JSON.stringify(data)) // type safe copy
  scheduleProcess()
}

async function handleResetWorkflow() {
  generatedJson.value = ''
  isProcessing.value = false
  nodes.value = []
  localStorage.setItem('creation-time', new Date().toISOString())
  await nextTick()
  processWorkflow()
}

// initial
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
