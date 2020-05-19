<template>
  <div>
    <div class="flex flex-row flex-wrap justify-evenly">
      <component
        v-for="window in windows"
        :key="window"
        :is="'window-' + window"
        class="w-32 h-24 m-3 border cursor-pointer bg-surface"
        @click.native="selectValue(window)"
      >
        <div class="flex items-center justify-center w-full h-16">
          <CheckBox v-if="value === window" />
        </div>
      </component>
    </div>
  </div>
</template>

<script>
import WindowNone from "@/components/form/windows/WindowNone.vue";
import WindowMacOs from "@/components/form/windows/WindowMacOs.vue";
import WindowMacOsDark from "@/components/form/windows/WindowMacOsDark.vue";
import CheckBox from "@/components/form/CheckBox.vue";

export default {
  components: {
    WindowMacOs,
    WindowMacOsDark,
    WindowNone,
    CheckBox
  },
  data() {
    return {
      windows: ["none", "mac-os", "mac-os-dark"],
      value: "mac-os"
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
