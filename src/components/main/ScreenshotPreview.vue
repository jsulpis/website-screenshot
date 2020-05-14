<template>
  <img
    class="max-w-full mx-auto preview"
    :class="!src ? 'border bg-surface shadow-' + shadow : ''"
    :style="{
      width: (screenshotHeight * resolution.width) / resolution.height + 'px',
      height: screenshotHeight + 'px'
    }"
    :src="src || placeholder"
    alt="Screenshot preview"
  />
</template>

<script>
export default {
  props: {
    resolution: {
      type: Object,
      default: () => ({
        width: 0,
        height: 0
      })
    },
    src: {
      type: String
    },
    shadow: {
      type: String
    }
  },
  data() {
    return {
      screenshotHeight: 300,
      placeholder: "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    };
  },
  mounted() {
    if (window.innerWidth < 640) {
      this.screenshotHeight = 180;
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  animation: 1s appear;
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
