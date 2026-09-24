import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useCollectionFilter = defineStore("collectionFilter", () => {
  const savedCols = localStorage.getItem("app_grid_cols");
  const gridCols = ref(savedCols ? Number(savedCols) : 2);

  const sortBy = ref("rating_desc");
  const groupBy = ref("none");

  watch(gridCols, (newCols) => {
    localStorage.setItem("app_grid_cols", newCols);
  });

  function setGridCols(cols) {
    gridCols.value = cols;
  }

  function resetFilters() {
    sortBy.value = "rating_desc";
    groupBy.value = "none";
  }

  return {
    gridCols,
    sortBy,
    groupBy,
    setGridCols,
    resetFilters,
  };
});
