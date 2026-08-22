<script setup>
import { AtSign, Plus } from "@lucide/vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import UserAvatar from "./UserAvatar.vue";
import UserPill from "./UserPill.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  searchResults: {
    type: Array,
    default: () => [],
  },
  searchQuery: {
    type: String,
    default: "",
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

const emit = defineEmits([
  "update:modelValue",
  "update:searchQuery",
  "select-user",
]);

function handleSelect(user) {
  if (!props.modelValue.some((m) => m.uid === user.uid)) {
    emit("update:modelValue", [...props.modelValue, user]);
  }
  emit("select-user", user);
}

function handleRemove(uid) {
  emit(
    "update:modelValue",
    props.modelValue.filter((m) => m.uid !== uid),
  );
}
</script>

<template>
  <div class="relative">
    <BaseInput
      :model-value="searchQuery"
      @update:model-value="emit('update:searchQuery', $event)"
      :label="label"
      :placeholder="placeholder"
      :icon="AtSign"
    />

    <div
      v-if="searchResults.length > 0"
      class="absolute z-20 left-0 right-0 max-h-56 mt-2 rounded-2xl border border-gray-200 dark:border-[#242C3C] bg-white dark:bg-[#181f2f] shadow-xl overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800"
    >
      <button
        v-for="user in searchResults"
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
    </div>

    <UserPill v-if="modelValue.length" :members="modelValue" @remove="handleRemove"/>
  </div>
</template>
