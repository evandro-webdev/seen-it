<script setup>
import { Frown, UsersRound } from "@lucide/vue";
import GroupListItem from "./GroupListItem.vue";
import BaseButton from "../ui/BaseButton.vue";

defineProps({
  groups: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["open-details", "create-group"]);
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="groups.length > 0"
      class="space-y-4"
    >
      <GroupListItem
        v-for="group in groups"
        :key="group.id"
        :group="group"
        @open-details="$emit('open-details', group)"
      />
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-2.5 py-6"
    >
      <div class="p-6 rounded-full bg-gray-100 dark:bg-[#222838]">
        <Frown class="w-12 h-12 text-gray-500 dark:text-[#aab6d8]" />
      </div>
      <p class="text-center text-sm max-w-sm text-gray-600 dark:text-gray-300">
        Você não possui nenhum grupo, clique no botão abaixo para criar um novo
        grupo
      </p>
    </div>

    <BaseButton
      @click="$emit('create-group')"
      label="Novo Grupo"
      :icon="UsersRound"
      variant="primary"
      size="lg"
      block
    />
  </div>
</template>
