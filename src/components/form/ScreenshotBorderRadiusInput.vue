<template>
  <div>
    <div class="flex flex-row flex-wrap justify-evenly">
      <div
        v-for="radius in radiuses"
        class="radius-preview"
        :style="{ 'border-radius': radius + 'px' }"
        @click="selectValue(radius)"
      >
        <CheckBox v-if="radius === value" />
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from "@/components/form/CheckBox.vue";

export default {
  components: {
    CheckBox
  },
  data() {
    return {
      radiuses: [0, 4, 8, 16],
      value: 8
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
