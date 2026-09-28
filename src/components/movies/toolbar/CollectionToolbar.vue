<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useGroupsStore } from "@/stores/groups";
import { useCollectionFilter } from "@/stores/collectionFilter.js";
import { useScrollMask } from "@/composables/useScrollMask.js";

import { SlidersHorizontal, Layers } from "@lucide/vue";

import SearchBar from "../SearchBar.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import PickRandomMovieButton from "./PickRandomMovieButton.vue";
import CollectionGridToggle from "./CollectionGridToggle.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["saved", "watched"].includes(value),
  },
  totalCount: { type: Number, default: 0 },
  isLoading: { type: Boolean, default: false },
});

const searchQuery = defineModel("searchQuery", { type: String, default: "" });

const groupsStore = useGroupsStore();
const filterStore = useCollectionFilter();

const { sortBy, groupBy } = storeToRefs(filterStore);

const { scrollContainer, showLeftGradient, showRightGradient, checkScrollPosition } =
  useScrollMask();

watch(
  () => groupsStore.activeGroup,
  () => {
    filterStore.resetFilters();
  },
);

const SORT_OPTIONS = [
  { value: "rating_desc", label: "Maior nota" },
  { value: "rating_asc", label: "Menor nota" },
  { value: "date_desc", label: "Recentes" },
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
  <div class="my-1 space-y-3">
    <div class="flex items-center gap-2">
      <SearchBar v-model:search-query="searchQuery" />
      <PickRandomMovieButton v-if="type === 'saved' && totalCount > 0" />
    </div>

    <div
      v-if="!isLoading && (totalCount > 0 || searchQuery)"
      class="flex items-center justify-between gap-2 text-xs"
    >
      <div
        ref="scrollContainer"
        @scroll="checkScrollPosition"
        class="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
        :class="[
          showLeftGradient && showRightGradient ? 'mask-both' : '',
          showLeftGradient && !showRightGradient ? 'mask-left' : '',
          !showLeftGradient && showRightGradient ? 'mask-right' : '',
        ]"
      >
        <div
          v-if="type === 'watched'"
          class="px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-[#161f30] flex items-center gap-1.5 shrink-0"
        >
          <SlidersHorizontal class="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
          <BaseSelect
            v-model="sortBy"
            :options="SORT_OPTIONS"
          />
        </div>

        <div
          v-if="groupsStore.activeGroup || type === 'watched'"
          class="px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-[#161f30] flex items-center gap-1.5 shrink-0"
        >
          <Layers class="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
          <BaseSelect
            v-model="groupBy"
            :options="groupByOptions"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <CollectionGridToggle />
      </div>
    </div>
  </div>
</template>
<style scoped>
.mask-left {
  mask-image: linear-gradient(to right, transparent 0%, black 32px);
}

.mask-right {
  mask-image: linear-gradient(to left, transparent 0%, black 32px);
}

.mask-both {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 32px,
    black calc(100% - 32px),
    transparent 100%
  );
}
</style>
