<template>
  <div
    class="mx-auto mb-8 overflow-hidden preview"
    :class="!src ? 'border mx-auto mt-5 bg-surface shadow-' + shadow : ''"
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
    <component :is="src || !window ? 'window-none' : 'window-' + window">
      <img v-show="!!src" :src="src" class="mx-auto" alt="Screenshot preview" />
    </component>
  </div>
</template>

<script>
import WindowMacOs from "@/components/form/windows/WindowMacOs.vue";
import WindowMacOsDark from "@/components/form/windows/WindowMacOsDark.vue";
import WindowNone from "@/components/form/windows/WindowNone.vue";

export default {
  components: {
    WindowMacOs,
    WindowMacOsDark,
    WindowNone
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
    },
    window: {
      type: String
    }
  },
  data() {
    return {
      screenshotHeight: 500
    };
  },
  mounted() {
    this.adjustPreviewHeight();
    window.addEventListener("resize", () => {
      this.adjustPreviewHeight();
    });
  },
  methods: {
    adjustPreviewHeight() {
      this.screenshotHeight = window.innerWidth < 1024 ? 180 : 500;
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
