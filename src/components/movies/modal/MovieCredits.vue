<script setup>
import { ref, computed } from "vue";
import { Users, ChevronDown, Clapperboard } from "@lucide/vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  maxActors: {
    type: Number,
    default: 5,
  },
});

const isOpen = ref(false);

const directorName = computed(() => {
  if (Array.isArray(props.movie.credits?.crew)) {
    const directorObj = props.movie.credits.crew.find(
      (member) => member.job === "Director",
    );
    if (directorObj?.name) return directorObj.name;
  }

  if (props.movie.director) {
    if (typeof props.movie.director === "object") {
      return props.movie.director.name || null;
    }
    return props.movie.director;
  }

  return null;
});

const topCast = computed(() => {
  let rawCast = [];

  if (Array.isArray(props.movie.credits?.cast)) {
    rawCast = props.movie.credits.cast;
  } else if (Array.isArray(props.movie.cast)) {
    rawCast = props.movie.cast;
  }

  return rawCast.slice(0, props.maxActors);
});

const hasCredits = computed(() => {
  return Boolean(directorName.value) || topCast.value.length > 0;
});
</script>

<template>
  <div
    v-if="hasCredits"
    class="my-4"
  >
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="w-full py-1 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <div
          class="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0"
        >
          <Users class="w-4 h-4" />
        </div>
        <span>Elenco e Ficha Técnica</span>
      </div>

      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="mt-3 space-y-3.5 py-1"
    >
      <div
        v-if="directorName"
        class="flex flex-col gap-1"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5"
        >
          <Clapperboard class="w-3.5 h-3.5" /> Direção
        </span>
        <p class="text-sm font-medium text-slate-800 dark:text-gray-200 pl-5">
          {{ directorName }}
        </p>
      </div>

      <div
        v-if="topCast.length > 0"
        class="flex flex-col gap-1.5"
      >
        <span
          class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5"
        >
          <Users class="w-3.5 h-3.5" /> Elenco Principal
        </span>
        <div class="flex flex-wrap gap-1.5 pl-5">
          <span
            v-for="actor in topCast"
            :key="actor.id || actor.name"
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-[#181d2c] text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800/80"
          >
            {{ actor.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
