<template>
  <div>
    <MacOsTopBar class="mac-os-dark" />
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
.mac-os-dark {
  background-image: linear-gradient(#888, #444);
}
</style>
