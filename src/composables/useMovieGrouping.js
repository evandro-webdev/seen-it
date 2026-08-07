import { computed } from "vue";

export function useMovieGrouping(movies, groupBy, options = {}) {
  const memberSections = computed(() => {
    if (groupBy.value !== "members") return [];

    const members = options.activeGroupMembers?.value || {};
    const currentUid = options.currentUid?.value;
    const groups = {};

    movies.value.forEach((movie) => {
      const uid = movie.saved_by || null;
      if (!groups[uid]) groups[uid] = [];
      groups[uid].push(movie);
    });

    return Object.entries(groups)
      .map(([uid, userMovies]) => {
        let memberData = members[uid];

        if (!memberData && uid === currentUid) {
          memberData = {
            name: options.currentUserDisplayName?.value || "Você",
            color: "#338CD5",
          };
        }

        return {
          uid,
          title: memberData?.name
            ? `Salvos por ${memberData.name}`
            : "Membro do Grupo",
          userColor: memberData?.color || "#338CD5",
          movies: userMovies,
        };
      })
      .sort((a, b) => {
        if (a.uid === currentUid) return -1;
        if (b.uid === currentUid) return 1;
        return 0;
      });
  });

  const runtimeSections = computed(() => {
    if (groupBy.value !== "runtime") return [];

    const buckets = [
      { id: "short", title: "Curtos (Até 1h 30m)", movies: [] },
      { id: "medium", title: "Padrão (1h 30m a 2h)", movies: [] },
      { id: "long", title: "Longos (Mais de 2h)", movies: [] },
      { id: "unknown", title: "Duração não informada", movies: [] },
    ];

    movies.value.forEach((movie) => {
      const runtime = movie.runtime;

      if (!runtime || typeof runtime !== "number" || runtime <= 0) {
        buckets[3].movies.push(movie);
      } else if (runtime <= 90) {
        buckets[0].movies.push(movie);
      } else if (runtime <= 120) {
        buckets[1].movies.push(movie);
      } else {
        buckets[2].movies.push(movie);
      }
    });

    return buckets.filter((bucket) => bucket.movies.length > 0);
  });

  const actorSections = computed(() => {
    if (groupBy.value !== "actors") return [];

    const actorMaps = {};

    movies.value.forEach((movie) => {
      if (Array.isArray(movie.cast)) {
        movie.cast.forEach((actor) => {
          if (!actorMaps[actor.id]) {
            actorMaps[actor.id] = {
              id: actor.id,
              name: actor.name,
              movies: [],
            };
          }

          if (!actorMaps[actor.id].movies.some((m) => m.id === movie.id)) {
            actorMaps[actor.id].movies.push(movie);
          }
        });
      }
    });

    const eligibleActors = Object.values(actorMaps).filter(
      (actor) => actor.movies.length >= 3,
    );

    const combinedGroups = {};

    eligibleActors.forEach((actor) => {
      const movieSignature = actor.movies
        .map((m) => m.id)
        .sort()
        .join("-");

      if (!combinedGroups[movieSignature]) {
        combinedGroups[movieSignature] = {
          actors: [],
          movies: actor.movies,
        };
      }

      combinedGroups[movieSignature].actors.push(actor.name);
    });

    return Object.values(combinedGroups)
      .sort((a, b) => b.movies.length - a.movies.length)
      .map((group) => {
        const actorsNames = group.actors;
        let titleText = "";

        if (actorsNames.length === 1) {
          titleText = actorsNames[0];
        } else if (actorsNames.length === 2) {
          titleText = `${actorsNames[0]} e ${actorsNames[1]}`;
        } else {
          titleText = `${actorsNames.slice(0, 2).join(", ")} +${actorsNames.length - 2} atores`;
        }

        return {
          id: group.movies.map((m) => m.id).join("-"),
          title: titleText,
          fullTitle: actorsNames.join(", "),
          movies: group.movies,
        };
      });
  });

  const directorSections = computed(() => {
    if (groupBy.value !== "directors") return [];

    const directorMaps = {};

    movies.value.forEach((movie) => {
      const dir = movie.director;
      if (!dir) return;

      const dirId = typeof dir === "object" ? dir.id : dir;
      const dirName = typeof dir === "object" ? dir.name : dir;

      if (!directorMaps[dirId]) {
        directorMaps[dirId] = {
          id: dirId,
          name: dirName,
          movies: [],
        };
      }

      if (!directorMaps[dirId].movies.some((m) => m.id === movie.id)) {
        directorMaps[dirId].movies.push(movie);
      }
    });

    return Object.values(directorMaps)
      .filter((dir) => dir.movies.length >= 2)
      .sort((a, b) => b.movies.length - a.movies.length)
      .map((dir) => ({
        id: dir.id,
        title: dir.name,
        movies: dir.movies,
      }));
  });

  const yearSections = computed(() => {
    if (groupBy.value !== "5years") return [];

    const groups = {};

    movies.value.forEach((movie) => {
      const releaseYear = movie.release_date
        ? parseInt(movie.release_date.slice(0, 4), 10)
        : null;

      let rangeLabel = "Ano desconhecido";
      let sortKey = -1;

      if (releaseYear && !isNaN(releaseYear)) {
        const startYear = Math.floor(releaseYear / 5) * 5;
        const endYear = startYear + 4;
        rangeLabel = `${startYear} - ${endYear}`;
        sortKey = startYear;
      }

      if (!groups[rangeLabel]) {
        groups[rangeLabel] = {
          id: rangeLabel,
          title: rangeLabel,
          sortKey,
          movies: [],
        };
      }
      groups[rangeLabel].movies.push(movie);
    });

    return Object.values(groups).sort((a, b) => b.sortKey - a.sortKey);
  });

  const activeGroupSections = computed(() => {
    if (groupBy.value === "members") return memberSections.value;
    if (groupBy.value === "runtime") return runtimeSections.value;
    if (groupBy.value === "actors") return actorSections.value;
    if (groupBy.value === "directors") return directorSections.value;
    if (groupBy.value === "5years") return yearSections.value;
    return [];
  });

  return {
    activeGroupSections,
  };
}
