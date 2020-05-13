<template>
  <div>
    <h4>{{ $t("index.shadow.title") }}</h4>
    <div class="flex flex-row justify-evenly">
      <div
        v-for="shadow in shadows"
        class="flex items-center justify-center w-24 h-24 mx-3 text-center cursor-pointer bg-surface"
        :class="'shadow-' + shadow"
        @click="selectValue(shadow)"
      >
        <FontAwesomeIcon v-show="shadow === value" icon="check-circle" size="lg" class="text-primary-500" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shadows: ["none", "small", "medium", "large"],
      value: "medium"
    };
  },
  methods: {
    selectValue(val) {
      this.value = val;
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.shadow-small {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.shadow-medium {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}
.shadow-large {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
}
</style>
