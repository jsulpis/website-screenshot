<template>
  <div>
    <InfoBox v-if="displayInfo">
      <p>{{ $t("index.shadow.info") }}</p>
    </InfoBox>
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
  </div>
</template>

<script>
import InfoBox from "@/components/form/InfoBox.vue";
import CheckBox from "@/components/form/CheckBox.vue";

// purgecss whitelist: shadow-small shadow-medium shadow-large
export default {
  components: {
    InfoBox,
    CheckBox
  },
  data() {
    return {
      shadows: ["none", "small", "medium", "large"],
      value: "medium",
      displayInfo: false
    };
  },
  mounted() {
    this.$emit("change", this.value);
    if (window.innerWidth < 1024) {
      this.displayInfo = true;
    }
  },
  methods: {
    selectValue(val) {
      this.value = val;
      this.$emit("change", val);
    }
  }
};
</script>
