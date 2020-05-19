<template>
  <form class="flex flex-col items-center mt-16" @submit.prevent="fetchScreenshot()">
    <h1 class="mb-3 h3">{{ $t("index.title") }}</h1>
    <WebsiteUrlInput v-model="$v.url.$model" :error="$v.url.$error" class="mb-3 section" />

    <div class="mt-5 tabs section">
      <input type="radio" id="tab1" name="tab-control" checked />
      <input type="radio" id="tab2" name="tab-control" />
      <input type="radio" id="tab3" name="tab-control" />
      <input type="radio" id="tab4" name="tab-control" />
      <ul>
        <li>
          <label for="tab1" role="button">
            <FontAwesomeIcon icon="expand" size="sm" />
            <span>{{ $t("index.viewport-resolution.title") }}</span>
          </label>
        </li>
        <li>
          <label for="tab2" role="button">
            <FontAwesomeIcon icon="layer-group" size="sm" />
            <span>{{ $t("index.shadow.title") }}</span>
          </label>
        </li>
        <li>
          <label for="tab3" role="button">
            <FontAwesomeIcon icon="square" size="sm" />
            <span>{{ $t("index.border-radius") }}</span>
          </label>
        </li>
        <li>
          <label for="tab4" role="button">
            <FontAwesomeIcon icon="window-maximize" size="sm" />
            <span>{{ $t("index.window") }}</span>
          </label>
        </li>
      </ul>

      <div class="slider"><div class="indicator"></div></div>

      <div class="content">
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
          <h2>{{ $t("index.border-radius") }}</h2>
          <ScreenshotBorderRadiusInput @change="radius = $event" />
        </section>
        <section>
          <h2>{{ $t("index.window") }}</h2>
          <ScreenshotWindowInput @change="window = $event" />
        </section>
      </div>
    </div>

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
    ScreenshotWindowInput
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

/**
Copyright (c) 2020 by Alex (https://codepen.io/woranov/pen/NRqLWK)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

@import "bourbon";

/* colors */
$blue: theme("colors.primary.500");

$accent: $blue;
$accent-inactive: theme("colors.gray.500");
$secondary: $accent-inactive;

/* tab setting */
$tab-count: 4;
$indicator-width: 50px;
$indicator-height: 4px;

/* breakpoints */
$breakpoints: (
  medium: #{$tab-count * 250px},
  small: #{$tab-count * 250px}
);

/* selectors relative to radio inputs */
$label-selector: "~ ul > li";
$slider-selector: "~ .slider";
$content-selector: "~ .content > section";

@mixin tabs(
  $label-selector: $label-selector,
  $slider-selector: $slider-selector,
  $content-selector: $content-selector
) {
  @for $i from 1 through $tab-count {
    &:nth-of-type(#{$i}):checked {
      #{$label-selector}:nth-child(#{$i}) {
        @content;
      }

      #{$slider-selector} {
        transform: translateX(#{100% * ($i - 1)});
      }

      #{$content-selector}:nth-child(#{$i}) {
        display: block;
      }
    }
  }
}

.tabs {
  position: relative;
  min-width: #{$tab-count * 60px};
  input[name="tab-control"] {
    display: none;
  }

  .content section h2,
  ul li label {
    font-weight: bold;
    font-size: 18px;
    opacity: 0.8;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;

    li {
      box-sizing: border-box;
      flex: 1;
      width: #{100% / $tab-count};
      padding: 0 10px;
      text-align: center;

      label {
        transition: all 0.3s ease-in-out;
        padding: 5px auto;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
        -webkit-touch-callout: none;

        br {
          display: none;
        }

        svg {
          height: 1.2em;
          margin-right: 0.2em;
          fill: currentColor;
        }

        &:hover,
        &:focus,
        &:active {
          outline: 0;
        }
      }
    }
  }

  .slider {
    position: relative;
    width: #{100% / $tab-count};
    transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
    .indicator {
      position: relative;
      width: $indicator-width;
      max-width: 100%;
      margin: 0 auto;
      height: $indicator-height;
      background: $accent;
      border-radius: 1px;
    }
  }

  .content {
    margin-top: 30px;

    section {
      display: none;
      animation: {
        name: content;
        direction: normal;
        duration: 0.3s;
        timing-function: ease-in-out;
        iteration-count: 1;
      }
      line-height: 1.4;

      h2 {
        color: $accent;
        display: none;
        &::after {
          content: "";
          position: relative;
          display: block;
          width: 30px;
          height: 3px;
          background: $accent;
          margin-top: 5px;
          left: 1px;
        }
      }
    }
  }

  input[name="tab-control"] {
    @include tabs {
      > label {
        opacity: 1;
        cursor: default;
        color: $accent;

        svg {
          fill: $accent;
        }

        @media (max-width: map-get($breakpoints, small)) {
          background: rgba(0, 0, 0, 0.08);
        }
      }
    }
  }

  @keyframes content {
    from {
      opacity: 0;
      transform: translateY(5%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  @media (max-width: map-get($breakpoints, medium)) {
    ul li label {
      white-space: initial;

      br {
        display: initial;
      }

      svg {
        height: 1.5em;
      }
    }
  }

  @media (max-width: map-get($breakpoints, small)) {
    ul li label {
      padding: 5px;
      border-radius: 5px;

      span {
        display: none;
      }
    }

    .slider {
      display: none;
    }

    .content {
      margin-top: 20px;
      section h2 {
        display: block;
      }
    }
  }
}
</style>
