<template>
  <div class="mb-3 text-left">
    <label for="preset" class="text-light">{{ $t("index.viewport-resolution.preset") }}</label>
    <div class="wrapper">
      <select
        name="preset"
        id="preset"
        @change="$emit('change', $event.target.value)"
        class="pr-6 appearance-none form-control"
      >
        <option v-for="preset in presets" :value="`${preset.width}x${preset.height}`">
          {{ preset.name }}
        </option>
      </select>
      <div class="arrow">
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      presets: [
        {
          name: 'MacBook Pro 15"',
          width: 1440,
          height: 900
        },
        {
          name: 'MacBook Pro 13"',
          width: 1280,
          height: 800
        },
        {
          name: "Full HD",
          width: 1920,
          height: 1080
        },
        {
          name: "iPad",
          width: 768,
          height: 1024
        },
        {
          name: "iPad Pro",
          width: 1024,
          height: 1366
        },
        {
          name: "iPhone X",
          width: 375,
          height: 812
        },
        {
          name: "iPhone 6",
          width: 375,
          height: 667
        },
        {
          name: "Samsung S10",
          width: 360,
          height: 760
        },
        {
          name: "Samsung S7",
          width: 360,
          height: 640
        }
      ]
    };
  },
  mounted() {
    const firstItem = this.presets[0];
    const defaultWidth = firstItem.width;
    const defaultHeight = firstItem.height;

    this.$emit("change", `${defaultWidth}x${defaultHeight}`);
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  @apply relative;
  width: fit-content;
}

.arrow {
  @apply absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none;
}
</style>
