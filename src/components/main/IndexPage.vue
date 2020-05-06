<template>
  <div class="flex flex-col items-center mt-16">
    <ViewportResolutionInput @resolution="resolution = $event" />

    <button class="w-24 px-1 my-3 text-white btn bg-primary-700" :disabled="buttonDisabled" @click="fetchScreenshot()">
      <div v-if="loading" id="spinner"></div>
      <span v-else>{{ $t("index.send") }}</span>
    </button>

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

const EMPTY_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default {
  components: {
    ViewportResolutionInput
  },
  data() {
    return {
      resolution: {},
      screenshotHeight: 300,
      screenshotSrc: EMPTY_IMG,
      loading: false,
      buttonDisabled: false
    };
  },
  watch: {
    resolution() {
      this.screenshotSrc = EMPTY_IMG;
      this.buttonDisabled = false;
    }
  },
  mounted() {
    if (window.innerWidth < 640) {
      this.screenshotHeight = 180;
    }
  },
  methods: {
    fetchScreenshot() {
      this.buttonDisabled = true;
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000); // Until I find a better option
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

#spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
