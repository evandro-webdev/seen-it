<script setup>
import { ref, watch } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { useToastStore } from "@/stores/toast.js";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { createGroupSchema } from "@/schemas/group.schema.js";
import { getRandomGroupTheme, GROUP_THEMES } from "@/constants/colors.js";

import { ArrowLeft, Loader2, Popcorn, UsersRound } from "@lucide/vue";

import BaseButton from "../ui/BaseButton.vue";
import BaseInput from "../forms/BaseInput.vue";
import ColorPicker from "../forms/ColorPicker.vue";
import UserPicker from "../forms/users/UserPicker.vue";

const emit = defineEmits(["closeForm"]);
const groupsStore = useGroupsStore();
const toastStore = useToastStore();

const searchQuery = ref("");
const searchResults = ref([]);
const isSearching = ref(false);
const serverError = ref("");

let debounceTimer = null;

watch(searchQuery, async (newQuery) => {
  clearTimeout(debounceTimer);
  const cleanQuery = newQuery.trim();

  if (cleanQuery.length < 2) {
    searchResults.value = [];
    isSearching.value = false;
    return;
  }

  isSearching.value = true;

  debounceTimer = setTimeout(async () => {
    try {
      searchResults.value = await groupsStore.searchUsersByUsername(cleanQuery);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300);
});

const { handleSubmit, isSubmitting, errors, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(createGroupSchema),
  initialValues: {
    groupName: "",
    invitedMembers: [],
    theme: getRandomGroupTheme(),
  },
});

const [groupName] = defineField("groupName");
const [members] = defineField("invitedMembers");
const [selectedTheme] = defineField("theme");

const onSubmit = handleSubmit(async (formValues) => {
  serverError.value = "";

  try {
    await groupsStore.createGroup(formValues);

    toastStore.success(`Grupo ${formValues.groupName} criado com sucesso.`);
    resetForm();
    searchQuery.value = "";
    emit("closeForm");
  } catch (error) {
    serverError.value = error.message || "Erro ao criar o grupo.";
  }
});
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-4"
  >
    <BaseInput
      v-model="groupName"
      label="Nome do grupo"
      placeholder="Digite o nome do grupo"
      :icon="Popcorn"
      :error="errors.groupName"
    />

    <div>
      <UserPicker
        v-model:members="members"
        v-model:search-query="searchQuery"
        :search-results="searchResults"
        :is-searching="isSearching"
      />
      <span
        v-if="errors.invitedMembers"
        class="text-xs text-red-500 font-medium mt-1 block"
      >
        {{ errors.invitedMembers }}
      </span>
    </div>

    <div>
      <ColorPicker
        v-model="selectedTheme"
        :color-options="GROUP_THEMES"
        label="Escolha a cor do grupo:"
      />
      <span
        v-if="errors.theme"
        class="text-xs text-red-500 font-medium mt-2 block"
      >
        {{ errors.theme }}
      </span>
    </div>

    <div
      v-if="serverError"
      class="p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg"
    >
      {{ serverError }}
    </div>

    <div class="flex gap-2 pt-2">
      <BaseButton
        label="Voltar"
        :icon="ArrowLeft"
        variant="ghost"
        size="md"
        type="button"
        @click="$emit('closeForm')"
      />

      <BaseButton
        type="submit"
        label="Criar grupo"
        variant="primary"
        size="lg"
        :disabled="isSubmitting"
        block
      >
        <template #icon>
          <Loader2
            v-if="isSubmitting"
            class="w-5 h-5 animate-spin"
          />
          <UsersRound
            v-else
            class="w-5 h-5"
          />
        </template>
      </BaseButton>
    </div>
  </form>
</template>
