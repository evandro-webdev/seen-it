<script setup>
import { Clapperboard } from "@lucide/vue";

import NotificationsButton from "./header/NotificationsButton.vue";
import ToggleThemeButton from "./header/ToggleThemeButton.vue";
import GroupActiveDisplay from "./header/GroupActiveDisplay.vue";
</script>

<template>
  <header class="p-4">
    <div class="flex justify-between items-center relative">
      <div class="mr-auto space-x-3 flex items-center">
        <Clapperboard class="w-6 h-6 text-[#0088FF]" />

        <GroupActiveDisplay />
      </div>

      <div class="ml-auto space-x-3 flex items-center">
        <ToggleThemeButton />
        <NotificationsButton />
      </div>
    </div>
  </header>
</template>
