<script setup>
    import { computed } from "vue";

    const props = defineProps({
        currentTab: {
            type: String,
            required: true,
        }
    })

    const placeholder = computed(() => {
        if (props.currentTab === 'watched') return 'Buscar filmes assistidos'
        if (props.currentTab === 'saved') return 'Buscar filmes salvos'
        return 'Qual filme você está procurando?'
    })

    const searchQuery = defineModel();

    const emit = defineEmits('search');
</script>

<template>
    <form @submit.prevent="emit('search', searchQuery)" class="relative">
        <input
            id="search-input" 
            type="search"
            v-model="searchQuery"
            class="w-full p-4 rounded-2xl text-sm text-gray-700 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            :class="{ 'pr-12': currentTab === 'discover' }"
            :placeholder="placeholder"
        />
        <button
            v-if="currentTab === 'discover'"
            type="submit"
            class="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white bg-linear-to-t from-[#194476] to-[#215DA2] transition-all"
        >
        <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
        </svg>
        </button>
    </form>
</template>