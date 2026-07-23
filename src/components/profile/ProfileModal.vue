<script setup>
import { ref, watch } from "vue";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { Check, User, UserRoundCheck, X } from "@lucide/vue";
import BaseButton from "../ui/BaseButton.vue";

const profileStore = useProfileStore();
const authStore = useAuthStore();

const name = ref("");
const selectedColor = ref("");
const avatarPreview = ref(null);
const selectedFile = ref(null);

const colorOptions = ["#338CD5", "#9367EB", "#D75870", "#55C06E", "#F69F40"];

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      name.value = newUser.displayName || "";
      selectedColor.value = newUser.color || "";
      avatarPreview.value = newUser.avatar_url || null;
    }
  },
  { immediate: true },
);

function handleFileChange(event) {
  const file = event.target.files[0];

  if (file) {
    selectedFile.value = file;

    avatarPreview.value = URL.createObjectURL(file);
  }
}

async function handleUpdate() {
  await profileStore.updateProfile({
    name: name.value,
    color: selectedColor.value,
    imageFile: selectedFile.value,
  });
}

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}
</script>

<template>
  <Transition
    name="modal"
    appear
    @enter="lockScroll"
    @after-leave="unlockScroll"
  >
    <div
      v-if="profileStore.isProfileModalOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
    >
      <div
        ref="profileModalRef"
        class="w-full py-6 px-4 bg-white dark:bg-[#121825] rounded-t-2xl overflow-y-auto space-y-8 modal-content"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <label
              for="avatar"
              class="cursor-pointer group"
            >
              <div
                v-if="avatarPreview"
                class="w-15 h-15 rounded-full overflow-hidden border-2 border-transparent group-hover:opacity-80 transition-opacity"
              >
                <img
                  :src="avatarPreview"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="p-4 rounded-full bg-blue-50 dark:bg-[#273056] hover:bg-blue-100 dark:hover:bg-[#313c6c] transition-colors"
              >
                <User class="w-7 h-7 text-blue-600 dark:text-white" />
              </div>
            </label>

            <input
              type="file"
              id="avatar"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />

            <div>
              <h2 class="text-3xl font-semibold text-gray-900 dark:text-white">
                Perfil
              </h2>
              <span class="text-gray-500 dark:text-[#9EB2CD]">
                Edite seu perfil
              </span>
            </div>
          </div>

          <button
            @click="profileStore.closeProfileModal"
            type="button"
            class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222838] dark:hover:bg-slate-800 active:scale-98 transition-colors"
          >
            <X class="text-gray-600 dark:text-[#A7B0C9]" />
          </button>
        </div>

        <form
          class="space-y-5"
          submit.prevent
        >
          <div class="relative">
            <User
              stroke-width="1"
              class="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              v-model="name"
              class="w-full p-4 pl-13.5 rounded-2xl border text-gray-900 placeholder-gray-400 dark:text-gray-300 border-gray-200 dark:border-[#242C3C] bg-gray-50 dark:bg-[#181f2f] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Digite o seu nome"
            />
          </div>

          <div class="space-y-2.5">
            <label class="font-medium text-gray-700 dark:text-white block"
              >Escolha a sua cor preferida:
            </label>
            <div class="flex gap-2">
              <button
                v-for="color in colorOptions"
                @click="selectedColor = color"
                :key="color"
                type="button"
                class="w-8 h-8 rounded-full active:scale-95 flex items-center justify-center transition-transform"
                :style="{
                  backgroundColor: color,
                }"
              >
                <Check
                  v-if="selectedColor === color"
                  class="text-white w-4 h-4"
                />
              </button>
            </div>
            <p class="text-sm text-gray-900 dark:text-[#9EB2CD]">
              Essa cor será exibida na lista de notas
            </p>
          </div>

          <BaseButton
            label="Salvar alterações"
            :icon="UserRoundCheck"
            variant="primary"
            size="lg"
            block
          />
        </form>
      </div>
    </div>
  </Transition>
</template>
