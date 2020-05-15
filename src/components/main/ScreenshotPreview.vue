<template>
  <div
    class="w-full max-w-full mx-auto overflow-hidden preview"
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
    <MacOSWindow>
      <img v-show="!!src" :src="src" class="mx-auto" alt="Screenshot preview" />
    </MacOSWindow>
  </div>
</template>

<script>
import MacOSWindow from "@/components/form/MacOSWindow.vue";

export default {
  components: {
    MacOSWindow
  },
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
