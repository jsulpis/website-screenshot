<template>
  <div>
    <h4>{{ $t("index.shadow.title") }}</h4>
    <div class="flex flex-row flex-wrap justify-evenly">
      <div
        v-for="shadow in shadows"
        class="flex items-center justify-center w-24 h-24 m-3 text-center cursor-pointer bg-surface"
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
