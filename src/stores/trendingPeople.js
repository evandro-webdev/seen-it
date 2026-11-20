import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getTrendingPeople } from "@/services/tmdb.js";

export const useTrendingPeopleStore = defineStore("trendingPeople", () => {
  const trendingPeople = ref([]);
  const isLoading = ref(false);

  const trendingActors = computed(() =>
    trendingPeople.value.filter((p) => p.known_for_department === "Acting"),
  );

  const trendingDirectors = computed(() =>
    trendingPeople.value.filter((p) => p.known_for_department === "Directing"),
  );

  async function loadTrendingPeople() {
    if (trendingPeople.value.length > 0) return;

    isLoading.value = true;
    try {
      const data = await getTrendingPeople("week", 1);
      trendingPeople.value = data.results || [];
    } catch (error) {
      console.error("Erro ao buscar pessoas em alta:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    trendingPeople,
    trendingActors,
    trendingDirectors,
    isLoading,
    loadTrendingPeople,
  };
});
