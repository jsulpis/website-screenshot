<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" />
    <ViewportResolutionInput
      v-model="$v.resolution.$model"
      :widthError="$v.resolution.width.$error"
      :heightError="$v.resolution.height.$error"
    />

    <SubmitButton :disabled="buttonDisabled || $v.$anyError" :loading="loading" />

    <ScreenshotPreview :resolution="resolution" :src="screenshotSrc" />
  </form>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";

import { required, url, between } from "vuelidate/lib/validators";
import fetch from "isomorphic-unfetch";

const EMPTY_SRC = "";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview,
    WebsiteUrlInput,
    SubmitButton
  },
  data() {
    return {
      resolution: {
        width: 0,
        height: 0
      },
      screenshotSrc: EMPTY_SRC,
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
      this.screenshotSrc = EMPTY_SRC;
    },
    url() {
      this.buttonDisabled = false;
    }
  },
  methods: {
    fetchScreenshot() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        this.buttonDisabled = true;

        const { width, height } = this.resolution;
        const apiUrl = `${process.env.baseUrl}/api/screenshot?url=${this.url}&width=${width}&height=${height}`;

        fetch(apiUrl)
          .then(res => res.text())
          .then(res => {
            this.loading = false;
            this.screenshotSrc = "data:image/gif;base64," + res;
          });
      }
    }
  }
};
</script>
