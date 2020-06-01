<template>
  <div class="flex flex-row flex-wrap justify-evenly">
    <div
      v-for="shadow in shadows"
      class="flex items-center justify-center w-24 h-24 m-3 text-center border cursor-pointer bg-surface"
      :class="'shadow-' + shadow"
      @click="selectValue(shadow)"
    >
      <CheckBox v-if="shadow === value" />
    </div>
  </div>
</template>

<script>
import CheckBox from "@/components/form/CheckBox.vue";

// purgecss whitelist: shadow-small shadow-medium shadow-large
export default {
  components: {
    CheckBox
  },
  data() {
    return {
      shadows: ["none", "small", "medium", "large"],
      value: "large"
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
