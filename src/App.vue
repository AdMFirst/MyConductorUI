<script setup lang="ts">
import CodeWindow from './components/CodeWindow.vue';
import Edge from './components/Edge.vue';
import HttpNode from './components/NodeTypes.vue/HttpNode.vue';
import InlineNode from './components/NodeTypes.vue/InlineNode.vue';
import SimpleNode from './components/NodeTypes.vue/SimpleNode.vue';
import StaticNode from './components/NodeTypes.vue/StaticNode.vue';
</script>

<template>
  <div class="min-h-dvh relative flex">
    <div class="w-3/5">
      <!-- Content for editing layer will go here -->
      <!-- here will be filed with chains of node and edges-->
      <!-- dyamically generate this later-->  
      <StaticNode type="start" />
      <Edge position=0 />
      <HttpNode />
      <Edge position=1 />
      <InlineNode />
      <Edge position=2 />
      <SimpleNode />
      <Edge position=3 />
      <StaticNode type="end" />
    </div>

    <!-- This will be the code layer  -->
    <div class="w-2/5 flex items-center justify-center">
      <CodeWindow />
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
</style>
