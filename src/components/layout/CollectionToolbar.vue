<script setup>
import { SlidersHorizontal, Dices, Grid2x2, Grid3x3 } from "@lucide/vue";
import SearchBar from "@/components/layout/SearchBar.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "default",
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: String,
    default: "rating_desc",
  },
  cols: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "pick-random",
  "update:sortBy",
  "update:cols",
]);
</script>

<template>
  <div class="py-2 lg:py-6 space-y-3">
    <SearchBar
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <div
      v-if="!isLoading && (totalCount > 0 || modelValue)"
      class="mt-2 flex justify-between items-center text-xs"
    >
      <div class="flex items-center gap-2">
        <div
          v-if="type === 'watched'"
          class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300"
        >
          <SlidersHorizontal class="w-4 h-4 text-[#0088FF]" />
          <select
            id="sort-select"
            :value="sortBy"
            @change="emit('update:sortBy', $event.target.value)"
            class="bg-transparent font-medium border-none focus:outline-none focus:ring-0 cursor-pointer pr-1"
          >
            <option
              value="rating_desc"
              class="dark:bg-[#121825]"
            >
              Nota (Maior)
            </option>
            <option
              value="rating_asc"
              class="dark:bg-[#121825]"
            >
              Nota (Menor)
            </option>
            <option
              value="date_desc"
              class="dark:bg-[#121825]"
            >
              Mais recentes
            </option>
          </select>
        </div>

        <button
          v-else-if="type === 'saved' && totalCount > 0"
          @click="emit('pick-random')"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0062b8] text-white text-xs font-semibold shadow-md active:scale-95 hover:bg-[#00529b] transition-all cursor-pointer"
        >
          <Dices class="w-4 h-4" />
          <span>Escolher aleatório</span>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex items-center bg-gray-100 dark:bg-[#161f30] p-0.5 rounded-lg sm:hidden"
        >
          <button
            @click="emit('update:cols', 2)"
            type="button"
            :class="[
              'p-1 rounded-md transition-all cursor-pointer',
              cols === 2
                ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            ]"
            title="2 Colunas"
          >
            <Grid2x2 class="w-3.5 h-3.5" />
          </button>
          <button
            @click="emit('update:cols', 3)"
            type="button"
            :class="[
              'p-1 rounded-md transition-all cursor-pointer',
              cols === 3
                ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            ]"
            title="3 Colunas"
          >
            <Grid3x3 class="w-3.5 h-3.5" />
          </button>
        </div>

        <span class="text-gray-500 dark:text-gray-400 font-medium">
          {{ totalCount }} {{ totalCount === 1 ? "filme" : "filmes" }}
        </span>
      </div>
    </div>
  </div>
</template>
