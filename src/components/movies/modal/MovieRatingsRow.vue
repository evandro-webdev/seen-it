<script setup>
import { UsersRound, Star } from "@lucide/vue";
import MovieRating from "../ui/MovieRating.vue";
import { formatRating } from "@/utils/formatters.js";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  members: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    class="p-2 mt-4 rounded-xl border border-gray-200 dark:border-[#2c3042] flex items-center gap-x-3 overflow-x-auto"
  >
    <template
      v-for="(member, uid) in members"
      :key="uid"
    >
      <MovieRating
        v-if="movie.reviews && movie.reviews[uid]"
        :uid="uid"
        :review="movie.reviews[uid]"
        :color="member.color || '#338CD5'"
        :has-comment="!!movie.reviews[uid].comment"
        @click="emit('update:modelValue', modelValue === uid ? null : uid)"
      />
    </template>

    <div
      class="px-3 py-1 rounded-xl bg-[#edf3fc] dark:bg-[#356dd51e] flex flex-shrink-0 items-center gap-2"
    >
      <div class="p-2 rounded-full border border-[#356dd5]">
        <UsersRound class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]" />
      </div>
      <div>
        <div class="flex items-center gap-1">
          <Star
            class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]"
            fill="currentColor"
          />
          <span
            class="block text-md font-medium text-[#356dd5] dark:text-[#4787ff]"
          >
            {{ formatRating(movie.average_rating) }}
          </span>
        </div>
        <span
          class="text-xs capitalize text-[#356dd5] dark:text-[#4787ff] block"
          >Média</span
        >
      </div>
    </div>

    <div
      class="px-3 py-1 rounded-xl bg-[#e9f5f2] dark:bg-[#399c8d1e] flex flex-shrink-0 items-center gap-2"
    >
      <div class="p-2 rounded-full border border-[#399c8d] bg-[#0d2b42]">
        <img
          src="/img/tmdb.svg"
          class="w-4 h-4"
        />
      </div>
      <div>
        <div class="flex items-center gap-1">
          <Star
            class="w-4 h-4 text-[#399c8d]"
            fill="currentColor"
          />
          <span class="block text-md font-medium text-[#399c8d]">
            {{ formatRating(movie.vote_average) }}
          </span>
        </div>
        <span class="text-xs capitalize text-[#399c8d] block">TMDB</span>
      </div>
    </div>
  </div>
</template>
