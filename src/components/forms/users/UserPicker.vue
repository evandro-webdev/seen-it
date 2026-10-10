<script setup>
import { computed } from "vue";

import { AtSign, Loader2, Plus } from "@lucide/vue";

import BaseInput from "@/components/forms/BaseInput.vue";
import UserAvatar from "./UserAvatar.vue";
import UserPill from "./UserPill.vue";

const props = defineProps({
  searchResults: {
    type: Array,
    default: () => [],
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Participantes",
  },
  placeholder: {
    type: String,
    default: "Nome de usuário participante",
  },
});

const searchQuery = defineModel("searchQuery", {
  type: String,
  default: "",
});

const members = defineModel("members", {
  type: Array,
  default: () => [],
});

const availableResults = computed(() => {
  return props.searchResults.filter(
    (user) => !members.value.some((m) => m.uid === user.uid),
  );
});

function handleSelect(user) {
  members.value = [...members.value, user];
  searchQuery.value = "";
}

function handleRemove(uid) {
  members.value = members.value.filter((m) => m.uid !== uid);
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <BaseInput
        v-model="searchQuery"
        :label="label"
        :placeholder="placeholder"
        :icon="AtSign"
      />
      <Loader2
        v-if="isSearching"
        class="w-4 h-4 animate-spin text-gray-400 absolute right-3 bottom-4"
      />
    </div>

    <div
      v-if="searchQuery.trim().length >= 2 && !isSearching"
      class="absolute z-20 left-0 right-0 max-h-56 mt-2 rounded-2xl border border-gray-200 dark:border-[#242C3C] bg-white dark:bg-[#181f2f] shadow-xl overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800"
    >
      <template v-if="availableResults.length > 0">
        <button
          v-for="user in availableResults"
          :key="user.uid"
          type="button"
          @click="handleSelect(user)"
          class="w-full p-3 text-left transition-colors flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#20293d]"
        >
          <div class="flex items-center gap-3">
            <UserAvatar
              :user="user"
              size="md"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                @{{ user.username }}
              </p>
            </div>
          </div>

          <Plus class="w-5 h-5 text-gray-400" />
        </button>
      </template>

      <div
        v-else
        class="p-4 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Nenhum usuário encontrado.
      </div>
    </div>

    <UserPill
      v-if="members.length"
      :members="members"
      @remove="handleRemove"
    />
  </div>
</template>
