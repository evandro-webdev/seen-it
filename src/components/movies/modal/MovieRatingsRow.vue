<script setup>
import { UsersRound, Star } from "@lucide/vue";
import MovieRating from "../ui/MovieRating.vue";
import { formatRating } from "@/utils/formatters.js";
import { useAuthStore } from "@/stores/auth.js";
import { getRandomUserColor } from "@/constants/colors.js";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  members: {
    type: [Object, Array, null],
    default: null,
  },
  modelValue: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);
const authStore = useAuthStore();

function getReviewerData(uid) {
  if (props.members && props.members[uid]) {
    return {
      name: props.members[uid].name,
      color: props.members[uid].color,
    };
  }

  if (uid === authStore.user?.uid) {
    return {
      name: authStore.user?.displayName || "Você",
      color: "#338CD5",
    };
  }

  return {
    name: "Membro",
    color: getRandomUserColor(),
  };
}
</script>

<template>
  <div
    class="mt-4 flex items-center gap-x-3 overflow-x-auto"
    :class="{
      'p-2 rounded-xl border border-gray-200 dark:border-[#2c3042]':
        movie?.reviews,
    }"
  >
    <template v-if="movie?.reviews">
      <template
        v-for="(review, uid) in movie.reviews"
        :key="uid"
      >
        <MovieRating
          :uid="String(uid)"
          :review="review"
          :name="getReviewerData(uid).name"
          :color="getReviewerData(uid).color"
          :has-comment="!!review.comment"
          @click="
            emit(
              'update:modelValue',
              modelValue === String(uid) ? null : String(uid),
            )
          "
        />
      </template>
    </template>

    <div
      v-if="movie?.reviews && members"
      class="px-3 py-1.5 rounded-xl bg-[#edf3fc] dark:bg-[#356dd51e] flex flex-shrink-0 items-center gap-2"
    >
      <div class="p-1.5 rounded-full border border-[#356dd5]">
        <UsersRound class="w-4 h-4 text-[#356dd5] dark:text-[#4787ff]" />
      </div>
      <div>
        <div class="flex items-center gap-1">
          <Star
            class="w-3.5 h-3.5 text-[#356dd5] dark:text-[#4787ff]"
            fill="currentColor"
          />
          <span
            class="block text-sm font-bold text-[#356dd5] dark:text-[#4787ff]"
          >
            {{ formatRating(movie.average_rating) }}
          </span>
        </div>
        <span
          class="text-[10px] uppercase tracking-wider font-semibold text-[#356dd5] dark:text-[#4787ff] block"
        >
          {{ members ? "Média" : "Sua Nota" }}
        </span>
      </div>
    </div>

    <div
      class="px-3 py-1.5 rounded-xl bg-[#e9f5f2] dark:bg-[#399c8d1e] flex flex-shrink-0 items-center gap-2"
    >
      <div class="p-1.5 rounded-full border border-[#399c8d] bg-[#0d2b42]">
        <img
          src="/img/tmdb.svg"
          class="w-4 h-4"
          alt="TMDB Logo"
        />
      </div>
      <div>
        <div class="flex items-center gap-1">
          <Star
            class="w-3.5 h-3.5 text-[#399c8d]"
            fill="currentColor"
          />
          <span class="block text-sm font-bold text-[#399c8d]">
            {{
              movie.vote_average > 0 ? formatRating(movie.vote_average) : "N/A"
            }}
          </span>
        </div>
        <span
          class="text-[10px] uppercase tracking-wider font-semibold text-[#399c8d] block"
        >
          {{ movie.vote_average > 0 ? "TMDB" : "Sem avaliações" }}
        </span>
      </div>
    </div>
  </div>
</template>
