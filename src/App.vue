<script setup lang="ts">
import CodeWindow from './components/CodeWindow.vue';
import Edge from './components/Edge.vue';
import HttpNode from './components/NodeTypes/HttpNode.vue';
import InlineNode from './components/NodeTypes/InlineNode.vue';
import SimpleNode from './components/NodeTypes/SimpleNode.vue';
import StaticNode from './components/NodeTypes/StaticNode.vue';

type InsertPayload = { position: number; type: 'http' | 'inline' | 'simple' };

const handleAddNode = (payload: InsertPayload) => {
  console.log('Add node requested', payload);
};
</script>

<template>
  <div class="min-h-dvh relative flex">
    <div class="w-3/5 overflow-y-auto h-screen p-4 scroll-hidden">
      <!-- Content for editing layer will go here -->
      <!-- here will be filed with chains of node and edges-->
      <!-- dyamically generate this later-->  
      <StaticNode type="start" />
      <Edge :position="0" @add-node="handleAddNode" />
      <HttpNode />
      <Edge :position="1" @add-node="handleAddNode" />
      <InlineNode />
      <Edge :position="2" @add-node="handleAddNode" />
      <SimpleNode />
      <Edge :position="3" @add-node="handleAddNode" />
      <StaticNode type="end" />
    </div>

    <!-- This will be the code layer  -->
    <div class="w-2/5 flex items-center justify-center h-screen">
      <CodeWindow />
    </div>
  </div>
</template>

<style scoped>
.scroll-hidden {
  scrollbar-width: none; /* Firefox */
}
.scroll-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

</style>

