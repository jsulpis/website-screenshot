<template>
  <div
    class="mx-auto overflow-hidden preview"
    :class="!src ? 'border border- mx-auto mt-5 mb-8 bg-surface shadow-' + shadow : ''"
    :style="
      !src
        ? {
            width: (screenshotHeight * resolution.width) / resolution.height + 'px',
            height: screenshotHeight + 'px',
            borderRadius: radius + 'px'
          }
        : {}
    "
  >
    <WindowMacOs>
      <img v-show="!!src" :src="src" class="mx-auto" alt="Screenshot preview" />
    </WindowMacOs>
  </div>
</template>

<script>
import WindowMacOs from "@/components/form/windows/WindowMacOs.vue";

export default {
  components: {
    WindowMacOs
  },
  props: {
    resolution: {
      type: Object,
      default: () => ({
        width: 0,
        height: 1
      })
    },
    src: {
      type: String
    },
    shadow: {
      type: String
    },
    radius: {
      type: Number
    }
  },
  data() {
    return {
      screenshotHeight: 500
    };
  },
  mounted() {
    if (window.innerWidth < 1024) {
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
