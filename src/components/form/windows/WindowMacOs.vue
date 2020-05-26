<template>
  <div>
    <MacOsTopBar class="mac-os-light" />
    <slot />
  </div>
</template>

<script>
import MacOsTopBar from "@/components/form/windows/MacOsTopBar.vue";

export default {
  components: {
    MacOsTopBar
  }
};
</script>

<style lang="scss" scoped>
.mac-os-light {
  background-image: linear-gradient(#f8f8f8, #ddd);
}
</style>
