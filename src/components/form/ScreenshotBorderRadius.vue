<template>
  <div>
    <h4>{{ $t("index.border-radius.title") }}</h4>
    <div class="flex flex-row flex-wrap justify-evenly">
      <div
        v-for="radius in radiuses"
        class="radius-preview"
        :style="{ 'border-radius': radius + 'px' }"
        @click="selectValue(radius)"
      >
        <FontAwesomeIcon v-show="radius === value" icon="check-circle" size="lg" class="text-primary-500" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radiuses: [0, 4, 8, 16],
      value: 2
    };
  },
  mounted() {
    this.$emit("change", this.value);
  },
  methods: {
    selectValue(val) {
      this.value = val;
      this.$emit("change", val);
    }
  }
};
</script>

<style scoped>
.radius-preview {
  @apply flex items-center justify-center w-24 h-24 m-3 text-center border cursor-pointer bg-surface;
}
</style>
