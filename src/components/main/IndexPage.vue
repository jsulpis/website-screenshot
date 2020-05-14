<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" />
    <ViewportResolutionInput
      v-model="$v.resolution.$model"
      :widthError="$v.resolution.width.$error"
      :heightError="$v.resolution.height.$error"
    />
    <ScreenshotShadowInput @change="shadow = $event" />

    <SubmitButton :disabled="buttonDisabled || $v.$anyError" :loading="loading" class="mt-8" />

    <p class="text-error" id="request-error" v-if="displayRequestError">{{ $t("index.request-error") }}</p>

    <ScreenshotPreview :resolution="resolution" :src="screenshotSrc" :shadow="shadow" />
  </form>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";

import { required, url, between } from "vuelidate/lib/validators";
import fetch from "isomorphic-unfetch";

const EMPTY_SRC = "";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview,
    WebsiteUrlInput,
    SubmitButton,
    ScreenshotShadowInput
  },
  data() {
    return {
      resolution: {
        width: 0,
        height: 0
      },
      screenshotSrc: EMPTY_SRC,
      shadow: "",
      loading: false,
      buttonDisabled: false,
      url: "",
      displayRequestError: false
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
      this.screenshotSrc = EMPTY_SRC;
    },
    url() {
      this.buttonDisabled = false;
    },
    shadow() {
      this.buttonDisabled = false;
      this.screenshotSrc = EMPTY_SRC;
    }
  },
  methods: {
    fetchScreenshot() {
      this.$v.$touch();
      this.displayRequestError = false;
      if (!this.$v.$invalid) {
        this.loading = true;
        this.buttonDisabled = true;
        const { width, height } = this.resolution;
        const apiUrl = `${process.env.baseUrl}/api/screenshot?url=${this.url}&width=${width}&height=${height}&shadow=${this.shadow}`;
        fetch(apiUrl)
          .then(res => res.text())
          .then(res => {
            this.screenshotSrc = "data:image/png;base64," + res;
          })
          .catch(() => {
            this.displayRequestError = true;
          })
          .finally(() => (this.loading = false));
      }
    }
  }
};
</script>

<style scoped>
form > div {
  @apply w-full;
}

@screen sm {
  form > div {
    @apply w-2/3;
  }
}
</style>
