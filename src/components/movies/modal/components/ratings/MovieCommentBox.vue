<script setup>
import { computed } from "vue";
import { useGroupsStore } from "@/stores/groups";
import { useMovieDetailsStore } from "@/stores/movieDetails";
import { getUserColor } from "@/constants/colors";

const props = defineProps({
  reviewer: {
    type: String,
    default: null,
  },
});

const groupsStore = useGroupsStore();
const movieDetailsStore = useMovieDetailsStore();

const movie = computed(() => movieDetailsStore.selectedMovie);

const reviewerMember = computed(() => {
  return groupsStore.activeGroupMembers?.[props.reviewer];
});

const name = computed(() => reviewerMember.value?.name);

const comment = computed(() => {
  if (!props.reviewer || !movie.value?.reviews) return null;
  return movie.value.reviews[props.reviewer]?.comment;
});

const userColor = computed(() => {
  return getUserColor(reviewerMember.value?.color);
});
</script>

<template>
  <div
    v-if="comment"
    class="mt-3 p-3 rounded-xl border transition-all duration-200 overflow-hidden bg-gray-50/80 dark:bg-slate-800/40 border-gray-200/80 dark:border-gray-700/60"
    :style="{ borderLeftColor: userColor?.primary, borderLeftWidth: '3px' }"
  >
    <div class="mb-1.5 flex items-center gap-1.5">
      <span
        class="w-1.5 h-1.5 rounded-full"
        :style="{ backgroundColor: userColor?.primary || 'currentColor' }"
      />

      <span
        class="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400"
      >
        {{ name }}
      </span>
    </div>

    <p
      class="pl-3 border-l text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
      :style="{
        borderColor: userColor?.primary
          ? `${userColor.primary}40`
          : 'transparent',
      }"
    >
      {{ comment }}
    </p>
  </div>
</template>
