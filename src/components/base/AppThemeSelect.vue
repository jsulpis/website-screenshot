<template>
  <div>
    <app-button-select
      v-for="theme in themes"
      :key="theme.value"
      @click="$colorMode.preference = theme.value"
      class="theme-button"
      :class="{ active: $colorMode.preference === theme.value }"
    >
      <FontAwesomeIcon :icon="theme.icon" size="sm" class="mr-1" />
      {{ $t("theme." + theme.value) }}
    </app-button-select>
  </div>
</template>

<script>
import AppButtonSelect from "@/components/base/AppButtonSelect.vue";

export default {
  components: {
    AppButtonSelect
  },
  data() {
    return {
      themes: [
        { value: "light", icon: ["far", "sun"] },
        { value: "dark", icon: ["fas", "moon"] }
      ]
    };
  }
};
</script>

<style scoped>
.theme-button {
  width: 7rem;
}
</style>
