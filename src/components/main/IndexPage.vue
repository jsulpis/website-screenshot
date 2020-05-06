<template>
  <div class="flex flex-col items-center mt-16">
    <ViewportResolutionInput @resolution="resolution = $event" />

    <button class="my-3 text-white btn bg-primary-700" @click="fetchScreenshot()">{{ $t("index.send") }}</button>

    <img
      class="max-w-full mx-auto border preview bg-surface"
      :style="{
        width: (screenshotHeight * resolution.width) / resolution.height + 'px',
        height: screenshotHeight + 'px'
      }"
      :src="screenshotSrc"
      alt="Screenshot preview"
    />
  </div>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";

const EMPTY_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview
  },
  data() {
    return {
      resolution: {},
      screenshotHeight: 300,
      screenshotSrc: EMPTY_IMG
    };
  },
  watch: {
    resolution() {
      this.screenshotSrc = EMPTY_IMG;
    }
  },
  mounted() {
    if (window.innerWidth < 640) {
      this.screenshotHeight = 180;
    }
  },
  methods: {
    fetchScreenshot() {
      const { width, height } = this.resolution;
      this.screenshotSrc = `${process.env.VERCEL_URL}/api/screenshot?url=nuxtjs-template.netlify.app&width=${width}&height=${height}`;
    }
  }
};
</script>

<style scoped>
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
