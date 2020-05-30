<template>
  <div class="screen-dimensions">
    <InfoBox>
      <p>{{ $t("index.viewport-resolution.info") }}</p>
    </InfoBox>
    <div class="flex-row lg:flex justify-evenly">
      <ScreenshotResolutionPresets class="mr-10" @change="updateDataFromPreset($event)" />

      <ul>
        <li :class="{ 'form-group--error': widthError }">
          <label for="width" class="block text-light">{{ $t("index.viewport-resolution.width") }}</label>
          <input
            v-model.lazy.number="width"
            type="number"
            name="width"
            placeholder="1440"
            class="w-24 lg:w-32 form-control"
          />
          <span class="text-sm opacity-50">px</span>
        </li>

        <FontAwesomeIcon
          class="p-1 mx-3 border rounded-full cursor-pointer bg-surface"
          icon="arrows-alt-h"
          size="lg"
          @click="switchAspectRatio()"
        />

        <li :class="{ 'form-group--error': heightError }">
          <label for="height" class="block text-light">{{ $t("index.viewport-resolution.height") }}</label>
          <input
            v-model.lazy.number="height"
            type="number"
            name="height"
            placeholder="900"
            class="w-24 sm:w-32 form-control"
          />
          <span class="text-sm opacity-50">px</span>
        </li>
      </ul>
    </div>
    <p v-show="widthError || heightError" class="mt-2 text-center text-error">
      {{ $t("index.viewport-resolution.input-error", ["360", "1920"]) }}
    </p>
  </div>
</template>

<script>
import ScreenshotResolutionPresets from "@/components/form/ScreenshotResolutionPresets.vue";
import InfoBox from "@/components/form/InfoBox.vue";

export default {
  components: {
    ScreenshotResolutionPresets,
    InfoBox
  },
  props: {
    widthError: {
      type: Boolean
    },
    heightError: {
      type: Boolean
    }
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  watch: {
    width() {
      this.emitResolution();
    },
    height() {
      this.emitResolution();
    }
  },
  methods: {
    updateDataFromPreset(event) {
      const [width, height] = event.split("x");
      this.width = +width;
      this.height = +height;
    },
    emitResolution() {
      this.$emit("input", { width: this.width, height: this.height });
    },
    switchAspectRatio() {
      [this.width, this.height] = [this.height, this.width];
    }
  }
};
</script>

<style lang="scss">
.screen-dimensions {
  margin-bottom: -21px; // yeah this is bad, sorry
  label {
    @apply mb-1;
  }

  li {
    @apply text-left inline-block;
  }
}
</style>
