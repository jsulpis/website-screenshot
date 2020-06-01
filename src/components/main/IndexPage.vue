<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <h1 class="mb-3 h3">{{ $t("index.title") }}</h1>
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" class="mb-3 section" />

    <Tabs class="mt-5 section" :tabsLabels="tabsLabels">
      <section>
        <h2 class="mb-3">{{ $t("index.viewport-resolution.title") }}</h2>
        <ScreenshotResolutionInput
          v-model="$v.resolution.$model"
          :widthError="$v.resolution.width.$error"
          :heightError="$v.resolution.height.$error"
        />
      </section>
      <section>
        <h2 class="mb-3">{{ $t("index.shadow.title") }}</h2>
        <ScreenshotShadowInput @change="shadow = $event" />
      </section>
      <section>
        <h2>{{ $t("index.corners") }}</h2>
        <ScreenshotBorderRadiusInput @change="radius = $event" />
      </section>
      <section>
        <h2>{{ $t("index.window") }}</h2>
        <ScreenshotWindowInput @change="window = $event" />
      </section>
    </Tabs>

    <SubmitButton :disabled="buttonDisabled || $v.$anyError" :loading="loading" class="mt-8" />

    <p class="text-error" id="request-error" v-if="displayRequestError">{{ $t("index.request-error") }}</p>

    <ScreenshotPreview
      :resolution="resolution"
      :src="screenshotSrc"
      :shadow="shadow"
      :radius="radius"
      :window="window"
    />
  </form>
</template>

<script>
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";
import ScreenshotResolutionInput from "@/components/form/ScreenshotResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";
import ScreenshotBorderRadiusInput from "@/components/form/ScreenshotBorderRadiusInput.vue";
import ScreenshotWindowInput from "@/components/form/ScreenshotWindowInput.vue";
import Tabs from "@/components/main/Tabs.vue";

import { required, url, between } from "vuelidate/lib/validators";
import fetch from "isomorphic-unfetch";

const EMPTY_SRC = "";

export default {
  components: {
    ScreenshotResolutionInput,
    ScreenshotPreview,
    WebsiteUrlInput,
    SubmitButton,
    ScreenshotShadowInput,
    ScreenshotBorderRadiusInput,
    ScreenshotWindowInput,
    Tabs
  },
  data() {
    return {
      resolution: {
        width: 0,
        height: 0
      },
      screenshotSrc: EMPTY_SRC,
      shadow: "none",
      radius: 0,
      window: "none",
      loading: false,
      buttonDisabled: false,
      url: "",
      displayRequestError: false,
      tabsLabels: [
        {
          icon: "expand",
          text: this.$t("index.viewport-resolution.title")
        },
        {
          icon: "layer-group",
          text: this.$t("index.shadow.title")
        },
        {
          icon: "square",
          text: this.$t("index.corners")
        },
        {
          icon: "window-maximize",
          text: this.$t("index.window")
        }
      ]
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
    },
    window() {
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
          .then(res => (res.ok ? res.text() : Promise.reject()))
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
        radius: this.radius,
        window: this.window
      };
      Object.keys(queryParams).forEach(
        (key, index) => (apiUrl += `${index === 0 ? "?" : "&"}${key}=${queryParams[key]}`)
      );
      return apiUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
form > div {
  @apply w-full;
}

@screen sm {
  .section {
    @apply w-2/3;
  }
}
</style>
