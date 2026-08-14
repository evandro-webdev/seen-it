<script setup>
import { ref, onMounted, computed } from "vue";
import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth";
import { ArrowLeft, Pencil, Trash2, UsersRound } from "@lucide/vue";

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["back", "edit"]);

const groupsStore = useGroupsStore();
const authStore = useAuthStore();

const membersList = ref([]);
const isLoadingMembers = ref(true);

const isOwner = computed(() => props.group?.created_by === authStore.user?.uid);

onMounted(async () => {
  try {
    isLoadingMembers.value = true;

    const membersMap = await groupsStore.loadGroupMembers(props.group.members);

    membersList.value = Object.values(membersMap);
  } catch (error) {
    console.error("Erro ao carregar membros:", error);
  } finally {
    isLoadingMembers.value = false;
  }
});

async function handleDeleteGroup() {
  if (
    confirm(`Tem certeza que deseja excluir o grupo "${props.group.name}"?`)
  ) {
    try {
      await groupsStore.deleteGroup(props.group.id);
      emit("back");
    } catch (error) {
      console.error("Erro ao excluir grupo:", error);
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <button
        type="button"
        @click="emit('back')"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-[#A7B0C9]" />
      </button>

      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        Detalhes do Grupo
      </h3>

      <div class="w-9"></div>
    </div>

    <div
      class="p-4 rounded-2xl border border-gray-100 dark:border-[#242C3C] bg-gray-50/50 dark:bg-[#181F2F] flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="p-3 rounded-2xl shrink-0 text-white"
          :style="{
            backgroundImage: `linear-gradient(135deg, ${group.color?.primary || '#205FE2'}, ${group.color?.secondary || '#29A4FF'})`,
          }"
        >
          <UsersRound class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white text-base">
            {{ group.name }}
          </h4>
          <p class="text-xs text-gray-500 dark:text-[#ABB3C3]">
            {{ group.members?.length || 0 }} participantes
          </p>
        </div>
      </div>

      <button
        v-if="isOwner"
        type="button"
        @click="emit('edit', group)"
        class="p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
        title="Editar grupo"
      >
        <Pencil class="w-5 h-5" />
      </button>
    </div>

    <div class="space-y-3">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Participantes
      </h4>

      <div
        v-if="isLoadingMembers"
        class="space-y-2 max-h-48 overflow-hidden pr-1"
      >
        <div
          v-for="i in group.members?.length || 3"
          :key="i"
          class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100/80 dark:bg-[#181F2F]/60 animate-pulse"
        >
          <div
            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0"
          ></div>

          <div class="space-y-1.5">
            <div
              class="h-3.5 w-24 bg-gray-200 dark:bg-slate-700 rounded-md"
            ></div>
            <div
              class="h-2.5 w-16 bg-gray-200 dark:bg-slate-700/60 rounded-md"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="space-y-2 max-h-48 overflow-y-auto"
      >
        <div
          v-for="member in membersList"
          :key="member.uid"
          class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#181F2F]"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden"
              :style="{ backgroundColor: member.color || '#1D4776' }"
            >
              <img
                v-if="member.avatar_url"
                :src="member.avatar_url"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ member.name?.[0]?.toUpperCase() }}</span>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ member.name }}
              </p>
              <p class="text-xs text-gray-400">@{{ member.username }}</p>
            </div>
          </div>

          <span
            v-if="member.uid === group.created_by"
            class="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-medium"
          >
            Criador
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="isOwner"
      class="pt-2"
    >
      <button
        type="button"
        @click="handleDeleteGroup"
        class="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Trash2 class="w-4 h-4" />
        Excluir Grupo
      </button>
    </div>
  </div>
</template>
