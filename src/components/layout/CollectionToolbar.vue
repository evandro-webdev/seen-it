<script setup>
import { ref } from "vue";
import { useGroupsStore } from "@/stores/groups";
import {
  SlidersHorizontal,
  Dices,
  Grid2x2,
  Grid3x3,
  Layers,
} from "@lucide/vue";

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
  groupBy: {
    type: String,
    default: "none",
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
  "update:groupBy",
  "update:cols",
]);

const groupsStore = useGroupsStore();

const isRolling = ref(false);

function handlePickRandom() {
  if (isRolling.value) return;

  isRolling.value = true;
  emit("pick-random");

  setTimeout(() => {
    isRolling.value = false;
  }, 800);
}
</script>

<template>
  <div class="py-2 lg:py-6 space-y-3">
    <div class="flex items-center gap-2">
      <SearchBar
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <button
        v-if="type === 'saved' && totalCount > 0"
        @click="handlePickRandom"
        type="button"
        title="Escolher filme aleatório"
        aria-label="Escolher filme aleatório"
        :disabled="isRolling"
        class="h-[54px] w-[54px] rounded-2xl bg-[#0062b8] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-80"
      >
        <Dices
          class="w-6 h-6 transition-transform duration-500"
          :class="{ 'animate-spin': isRolling }"
        />
      </button>
    </div>

    <div
      v-if="!isLoading && (totalCount > 0 || modelValue)"
      class="mt-2 flex items-center justify-between gap-2 text-xs"
    >
      <div
        class="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 max-w-[calc(100%-90px)] sm:max-w-none"
      >
        <div
          v-if="type === 'watched'"
          class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-[#161f30] px-2 py-1 rounded-lg shrink-0"
        >
          <SlidersHorizontal class="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
          <select
            id="sort-select"
            :value="sortBy"
            @change="emit('update:sortBy', $event.target.value)"
            class="bg-transparent font-medium border-none focus:outline-none focus:ring-0 cursor-pointer p-0 text-xs text-ellipsis overflow-hidden whitespace-nowrap max-w-[105px] sm:max-w-none"
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

        <div
          v-if="groupsStore.activeGroup || type === 'watched'"
          class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-[#161f30] px-2 py-1 rounded-lg shrink-0"
        >
          <Layers class="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
          <select
            id="group-select"
            :value="groupBy"
            @change="emit('update:groupBy', $event.target.value)"
            class="bg-transparent font-medium border-none focus:outline-none focus:ring-0 cursor-pointer p-0 text-xs text-ellipsis overflow-hidden whitespace-nowrap max-w-[110px] sm:max-w-none"
          >
            <option
              value="none"
              class="dark:bg-[#121825]"
            >
              Sem grupo
            </option>
            <option
              v-if="groupsStore.activeGroup"
              value="members"
              class="dark:bg-[#121825]"
            >
              Por membro
            </option>
            <option
              v-if="type === 'watched'"
              value="5years"
              class="dark:bg-[#121825]"
            >
              Por 5 anos
            </option>
            <option
              value="actors"
              class="dark:bg-[#121825]"
              disabled
            >
              Principais atores
            </option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
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

        <span
          class="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap"
        >
          {{ totalCount }} {{ totalCount === 1 ? "filme" : "filmes" }}
        </span>
      </div>
    </div>
  </div>
</template>
