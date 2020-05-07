<template>
  <div class="flex flex-col items-center mt-16">
    <WebsiteUrlInput @url="url = $event" />
    <ViewportResolutionForm @resolution="resolution = $event" />

    <SendButton :disabled="buttonDisabled" :loading="loading" @click.native="fetchScreenshot()" />

    <ScreenshotPreview :resolution="resolution" :src="screenshotSrc" />
  </div>
</template>

<script>
import ViewportResolutionForm from "@/components/form/ViewportResolutionForm.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SendButton from "@/components/main/SendButton.vue";

const EMPTY_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default {
  components: {
    ViewportResolutionForm,
    ScreenshotPreview,
    WebsiteUrlInput,
    SendButton
  },
  data() {
    return {
      resolution: {},
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
  methods: {
    fetchScreenshot() {
      this.buttonDisabled = true;
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000); // Until I find a better option
      const { width, height } = this.resolution;
      this.screenshotSrc = `${process.env.VERCEL_URL}/api/screenshot?url=${this.url}&width=${width}&height=${height}`;
    }
  }
};
</script>
