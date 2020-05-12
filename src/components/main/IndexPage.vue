<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" />
    <ViewportResolutionInput
      v-model="$v.resolution.$model"
      :widthError="$v.resolution.width.$error"
      :heightError="$v.resolution.height.$error"
    />

    <SendButton :disabled="buttonDisabled" :loading="loading" />

    <ScreenshotPreview :resolution="resolution" :src="screenshotSrc" />
  </form>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SendButton from "@/components/main/SendButton.vue";

import { required, url, between } from "vuelidate/lib/validators";

const EMPTY_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview,
    WebsiteUrlInput,
    SendButton
  },
  data() {
    return {
      resolution: {
        width: 0,
        height: 0
      },
      screenshotSrc: EMPTY_IMG,
      loading: false,
      buttonDisabled: false,
      url: ""
    };
  },
  validations: {
    url: {
      required,
      url
    },
    resolution: {
      width: {
        required,
        between: between(360, 1920)
      },
      height: {
        required,
        between: between(360, 1920)
      }
    }
  },
  watch: {
    resolution() {
      this.buttonDisabled = false;
    },
    url() {
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
