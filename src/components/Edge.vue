<!-- Copyright (c) 2025 Aditya Mardi Pratama (AdMFirst) - All Rights Reserved -->
<script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps<{ position: number }>();

    const emit = defineEmits<{
        (e: "add-node", payload: { position: number; type: "simple" | "http" | "inline" }): void;
    }>();

    const isMenuOpen = ref(false);

    const selectType = (type: "simple" | "http" | "inline") => {
        emit("add-node", { position: props.position, type });
        isMenuOpen.value = false;
    };

    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
    };
</script>

<template>
    <div class="relative w-full">
        <!-- Arrow -->
        <div class="relative w-full h-auto flex items-center justify-center">
            <svg class="w-12 h-24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arrowhead" 
                            markerWidth="10" markerHeight="10"
                            refX="5" refY="5"
                            orient="auto"
                            markerUnits="strokeWidth"
                            overflow="visible">
                        <polygon points="0 0, 10 5, 0 10" fill="black" />
                    </marker>
                </defs>
                <line x1="50%" y1="0" x2="50%" y2="90%" 
                    stroke="black" stroke-width="2"
                    marker-end="url(#arrowhead)" />
            </svg>
        </div>
        
        <!-- Buttons -->
        <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
            <transition name="fade" mode="out-in">
                <!-- Open button -->
                <button
                    v-if="!isMenuOpen"
                    key="add"
                    type="button"
                    class="neobrutalism-button text-sm px-4 py-2"
                    @click="toggleMenu"
                >
                    Add Step
                </button>

                <!-- Menu -->
                <div
                    v-else
                    key="menu"
                    class="neobrutalism mt-2 max-w-[90%] mx-auto p-2 flex flex-wrap gap-2 z-20"
                >
                    <button type="button" class="neobrutalism-button neobrutalism-quinary flex-1 min-w-[80px]" @click="selectType('http')">
                        HTTP
                    </button>
                    <button type="button" class="neobrutalism-button neobrutalism-tertiary flex-1 min-w-[80px]" @click="selectType('inline')">
                        Inline
                    </button>
                    <button type="button" class="neobrutalism-button neobrutalism-quaternary flex-1 min-w-[80px]" @click="selectType('simple')">
                        Simple
                    </button>
                    <button
                        type="button"
                        class="neobrutalism-button flex-1 min-w-[80px] bg-[var(--nb-black)] text-[var(--nb-white)] neobrutalism-secondary hover:opacity-80"
                        @click="toggleMenu"
                    >
                        Cancel
                    </button>
                </div>
            </transition>
        </div>
    </div>
</template>



<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
