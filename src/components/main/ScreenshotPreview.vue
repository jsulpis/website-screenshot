<template>
  <div>
    <div
      class="mx-auto mb-3 overflow-hidden preview"
      :class="!src ? 'preview--empty shadow-' + shadow : ''"
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
        <img
          v-show="!!src"
          :src="src"
          class="mx-auto"
          alt="Screenshot preview"
          :style="src ? { height: screenshotHeight + 'px' } : {}"
        />
      </component>
    </div>
    <div class="mb-8 text-center">
      <template v-if="src">
        <a download="preview.png" :href="src" class="inline-block text-white btn bg-primary-700">
          <FontAwesomeIcon icon="download" class="mr-1" /> {{ $t("index.download.button") }}
        </a>
        <p class="mt-2 preview-hint">{{ $t("index.download.hint") }}</p>
      </template>
      <p class="preview-hint preview-info" v-else>{{ $t("index.preview-info") }}</p>
    </div>
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

  &--empty {
    border: 1px solid #ddd;
    @apply mt-5 bg-surface;
  }

  &-hint {
    @apply text-sm opacity-75;
  }
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
