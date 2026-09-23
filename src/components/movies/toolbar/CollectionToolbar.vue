<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";

import {
  SlidersHorizontal,
  Grid2x2,
  Grid3x3,
  Layers,
} from "@lucide/vue";

import SearchBar from "../SearchBar.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import PickRandomMovieButton from "./PickRandomMovieButton.vue";

const props = defineProps({
  type: { type: String, default: "default" },
  totalCount: { type: Number, default: 0 },
  isLoading: { type: Boolean, default: false },
});

const searchQuery = defineModel("searchQuery", { type: String, default: "" });
const sortBy = defineModel("sortBy", { type: String, default: "rating_desc" });
const groupBy = defineModel("groupBy", { type: String, default: "none" });
const cols = defineModel("cols", { type: Number, default: 2 });

const groupsStore = useGroupsStore();

const SORT_OPTIONS = [
  { value: "rating_desc", label: "Maior nota" },
  { value: "rating_asc", label: "Menor nota" },
  { value: "date_desc", label: "Mais recentes" },
];

const groupByOptions = computed(() => {
  const options = [{ value: "none", label: "Nenhum" }];

  if (groupsStore.activeGroup) {
    options.push({ value: "members", label: "Membro" });
  }

  if (props.type === "watched") {
    options.push(
      { value: "cast", label: "Elenco" },
      { value: "director", label: "Diretor" },
      { value: "decade", label: "Década" },
    );
  }

  if (props.type === "saved") {
    options.push({ value: "runtime", label: "Duração" });
  }

  return options;
});
</script>

<template>
  <div class="py-2 lg:py-6 space-y-3">
    <div class="flex items-center gap-2">
      <SearchBar v-model:search-query="searchQuery" />

      <PickRandomMovieButton v-if="type === 'saved' && totalCount > 0"/>
    </div>

    <div
      v-if="!isLoading && (totalCount > 0 || searchQuery)"
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
          <BaseSelect
            v-model="sortBy"
            :options="SORT_OPTIONS"
          />
        </div>

        <div
          v-if="groupsStore.activeGroup || type === 'watched'"
          class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-[#161f30] px-2 py-1 rounded-lg shrink-0"
        >
          <Layers class="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
          <BaseSelect
            v-model="groupBy"
            :options="groupByOptions"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <div
          class="flex items-center bg-gray-100 dark:bg-[#161f30] p-0.5 rounded-lg sm:hidden"
        >
          <button
            @click="cols = 2"
            type="button"
            :class="[
              'p-1 rounded-md transition-all cursor-pointer',
              cols === 2
                ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
                : 'text-gray-400',
            ]"
            title="2 Colunas"
          >
            <Grid2x2 class="w-3.5 h-3.5" />
          </button>
          <button
            @click="cols = 3"
            type="button"
            :class="[
              'p-1 rounded-md transition-all cursor-pointer',
              cols === 3
                ? 'bg-white dark:bg-[#202c42] text-[#0088FF] shadow-xs'
                : 'text-gray-400',
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
