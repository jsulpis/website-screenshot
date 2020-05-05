<template>
  <div class="mx-auto screen-dimensions sm:w-2/3">
    <h4 class="mb-2 text-left">
      {{ $t("index.screen-dimensions") }}
    </h4>
    <p class="px-2 py-1 mb-2 text-sm text-left border rounded opacity-90 bg-surface">
      <span class="inline-flex justify-center w-6 h-6 mr-2 font-serif font-bold border rounded-full bg-default">i</span
      >{{ $t("index.screen-note") }}
    </p>
    <ViewportResolutionPresets @change="updateDataFromPreset($event)" />

    <ul>
      <li :class="{ 'form-input--error': $v.width.$error }">
        <label for="width" class="block text-light">{{ $t("index.width") }}</label>
        <input
          v-model.lazy.number="$v.width.$model"
          type="number"
          name="width"
          id="width"
          placeholder="1440"
          class="w-32 form-control"
        />
        <span class="text-sm opacity-50">px</span>
      </li>

      <FontAwesomeIcon
        class="p-1 mx-3 border rounded-full shadow cursor-pointer bg-surface"
        icon="arrows-alt-h"
        size="lg"
        @click="switchAspectRatio()"
      />

      <li :class="{ 'form-input--error': $v.height.$error }">
        <label for="height" class="block text-light">{{ $t("index.height") }}</label>
        <input
          v-model.lazy.number="$v.height.$model"
          type="number"
          name="height"
          id="height"
          placeholder="900"
          class="w-32 form-control"
        />
        <span class="text-sm opacity-50">px</span>
      </li>
    </ul>
    <p v-show="$v.width.$error" class="text-red-500 width-error">
      {{ $t("index.error.width", ["360", "1920"]) }}
    </p>
    <p v-show="$v.height.$error" class="text-red-500 height-error">
      {{ $t("index.error.height", ["640", "1366"]) }}
    </p>
  </div>
</template>

<script>
import { required, numeric, between } from "vuelidate/lib/validators";
import ViewportResolutionPresets from "@/components/form/ViewportResolutionPresets.vue";

export default {
  components: {
    ViewportResolutionPresets
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  validations: {
    width: {
      required,
      between: between(360, 1920)
    },
    height: {
      required,
      between: between(640, 1366)
    }
  },
  watch: {
    width() {
      this.emitResolutionIfNoError();
    },
    height() {
      this.emitResolutionIfNoError();
    }
  },
  methods: {
    updateDataFromPreset(event) {
      const [width, height] = event.split("x");
      this.width = +width;
      this.height = +height;
    },
    emitResolutionIfNoError() {
      if (!this.$v.width.$error && !this.$v.height.$error) {
        this.$emit("resolution", { width: this.width, height: this.height });
      }
    },
    switchAspectRatio() {
      [this.width, this.height] = [this.height, this.width];
    }
  }
};
</script>

<style lang="scss">
.screen-dimensions {
  label {
    @apply mb-1;
  }

  li {
    @apply text-left mb-3 inline-block;

    &.form-input--error {
      @apply text-red-500;

      input {
        @apply border border-red-500;
      }
    }
  }
}

.width-error,
.height-error {
  @apply inline-block text-sm;
}
</style>
