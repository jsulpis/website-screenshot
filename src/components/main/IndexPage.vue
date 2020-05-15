<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" class="section" />
    <ViewportResolutionInput
      v-model="$v.resolution.$model"
      :widthError="$v.resolution.width.$error"
      :heightError="$v.resolution.height.$error"
      class="section"
    />
    <ScreenshotShadowInput @change="shadow = $event" class="section" />

    <ScreenshotBorderRadius @change="radius = $event" class="section" />

    <SubmitButton :disabled="buttonDisabled || $v.$anyError" :loading="loading" class="mt-8" />

    <p class="text-error" id="request-error" v-if="displayRequestError">{{ $t("index.request-error") }}</p>

    <ScreenshotPreview :resolution="resolution" :src="screenshotSrc" :shadow="shadow" :radius="radius" />
  </form>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";
import ScreenshotBorderRadius from "@/components/form/ScreenshotBorderRadius.vue";

import { required, url, between } from "vuelidate/lib/validators";
import fetch from "isomorphic-unfetch";

const EMPTY_SRC = "";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview,
    WebsiteUrlInput,
    SubmitButton,
    ScreenshotShadowInput,
    ScreenshotBorderRadius
  },
  data() {
    return {
      resolution: {
        width: 0,
        height: 0
      },
      screenshotSrc: EMPTY_SRC,
      shadow: "",
      radius: 0,
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
    },
    radius() {
      this.buttonDisabled = false;
      this.screenshotSrc = EMPTY_SRC;
    }
  },
  methods: {
    fetchScreenshot() {
      this.$v.$touch();
      this.displayRequestError = false;
      if (!this.$v.$invalid) {
        this.buttonDisabled = true;
        this.loading = true;

        fetch(this.fullApiUrl)
          .then(res => res.text())
          .then(res => (this.screenshotSrc = "data:image/png;base64," + res))
          .catch(() => {
            this.displayRequestError = true;
            this.buttonDisabled = false;
          })
          .finally(() => (this.loading = false));
      }
    }
  },
  computed: {
    fullApiUrl() {
      const currentLocation = window ? window.location.origin : "";
      let apiUrl = `${process.env.BASE_URL || currentLocation}/api/screenshot`;
      const queryParams = {
        url: this.url,
        width: this.resolution.width,
        height: this.resolution.height,
        shadow: this.shadow,
        radius: this.radius
      };
      Object.keys(queryParams).forEach(
        (key, index) => (apiUrl += `${index === 0 ? "?" : "&"}${key}=${queryParams[key]}`)
      );
      return apiUrl;
    }
  }
};
</script>

<style scoped>
form > div {
  @apply w-full;
}

@screen sm {
  .section {
    @apply w-2/3;
  }
}
</style>
