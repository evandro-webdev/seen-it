<script setup>
import { useTrendingPeopleStore } from "@/stores/trendingPeople";
import { TrendingUp } from "@lucide/vue";

const trendingPeopleStore = useTrendingPeopleStore();

trendingPeopleStore.loadTrendingPeople();

const emit = defineEmits(["see-all", "select-actor"]);

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}
</script>

<template>
  <section class="w-full">
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-1.5 items-center">
        <TrendingUp class="w-5 h-5 text-[#0088FF] shrink-0" />

        <h2 class="font-bold text-[#10355E] dark:text-[#B0D5FE]">
          Atores em alta
        </h2>
      </div>

      <button
        type="button"
        @click="emit('see-all')"
        class="text-xs font-semibold text-[#0088FF] hover:underline cursor-pointer"
      >
        Ver todos
      </button>
    </div>

    <div
      class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <button
        v-for="actor in trendingPeopleStore.trendingActors"
        :key="actor.id"
        type="button"
        @click="emit('select-actor', actor)"
        class="flex flex-col items-center gap-2 shrink-0 w-24 sm:w-28 snap-start text-center cursor-pointer focus:outline-none"
      >
        <div
          class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#0088FF]/25 transition-colors bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
        >
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
            :alt="actor.name"
            loading="lazy"
            class="w-full h-full object-cover object-[50%_20%] transition-transform duration-300"
          />

          <span
            v-else
            class="text-base sm:text-lg font-bold tracking-wide text-[#10355E]/70 dark:text-[#B0D5FE]/80"
          >
            {{ getInitials(actor.name) }}
          </span>
        </div>

        <span
          class="w-full truncate text-xs font-medium text-[#10355E] dark:text-[#B0D5FE] transition-colors"
          :title="actor.name"
        >
          {{ actor.name }}
        </span>
      </button>
    </div>
  </section>
</template>
