<script setup>
import { ref, watch } from "vue";
import { useGroupsStore } from "@/stores/groups.js";
import { useToastStore } from "@/stores/toast.js";

import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { createGroupSchema } from "@/schemas/group.schema.js";

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
const isSubmitting = ref(false);

const colorOptions = [
  { primary: "#205FE2", secondary: "#29A4FF" },
  { primary: "#A23BD1", secondary: "#B27AF1" },
  { primary: "#2CA886", secondary: "#55C06E" },
  { primary: "#F7516A", secondary: "#FA818D" },
  { primary: "#FA7F39", secondary: "#F69F40" },
  { primary: "#613FE5", secondary: "#855CF4" },
];

const serverError = ref("");

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(createGroupSchema),
  initialValues: {
    groupName: "",
    invitedMembers: [],
    color: colorOptions[0],
  },
});

const {
  value: groupName,
  errorMessage: groupNameError,
  meta: groupNameMeta,
} = useField("groupName");

const { value: members, errorMessage: membersError } =
  useField("invitedMembers");
const { value: selectedColor } = useField("color");

watch(searchQuery, async (newQuery) => {
  const cleanQuery = newQuery.trim();

  if (cleanQuery.length < 2) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  try {
    const results = await groupsStore.searchUsersByUsername(cleanQuery);
    searchResults.value = results.filter(
      (user) => !members.value.some((m) => m.uid === user.uid),
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  } finally {
    isSearching.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";
  isSubmitting.value = true;

  try {
    await groupsStore.createGroup({
      groupName: values.groupName,
      invitedMembers: values.invitedMembers,
      color: values.color,
    });

    const createdGroupName = values.groupName;
    resetForm();
    searchQuery.value = "";

    toastStore.success(`Grupo ${createdGroupName} criado com sucesso.`);
    emit("closeForm");
  } catch (error) {
    serverError.value = error.message || "Erro ao criar o grupo.";
    console.error("Erro ao criar grupo:", error.message);
  } finally {
    isSubmitting.value = false;
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
      :error="groupNameMeta.touched ? groupNameError : ''"
    />

    <div>
      <UserPicker
        v-model="members"
        v-model:search-query="searchQuery"
        :search-results="searchResults"
        @select-user="searchQuery = ''"
      />
      <span
        v-if="membersError"
        class="text-xs text-red-500 font-medium mt-1 block"
      >
        {{ membersError }}
      </span>
    </div>

    <ColorPicker
      v-model="selectedColor"
      :options="colorOptions"
      label="Escolha a cor do grupo:"
    />

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
