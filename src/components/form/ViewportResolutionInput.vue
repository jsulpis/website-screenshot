<template>
  <div class="screen-dimensions sm:w-2/3">
    <h4 class="mb-2 text-left">
      {{ $t("index.screen-dimensions") }}
    </h4>
    <div class="px-3 py-2 mb-2 text-sm text-left border rounded opacity-90 bg-surface">
      <div
        class="inline-flex justify-center float-left w-5 h-5 mr-2 font-serif text-xs font-bold align-top border rounded-full bg-default"
      >
        i
      </div>
      <p>{{ $t("index.screen-note") }}</p>
    </div>
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
          class="w-24 sm:w-32 form-control"
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
          class="w-24 sm:w-32 form-control"
        />
        <span class="text-sm opacity-50">px</span>
      </li>
    </ul>
    <p v-show="$v.width.$error || $v.height.$error" class="inline-block text-sm text-red-500" id="input-error">
      {{ $t("index.input-error", ["360", "1920"]) }}
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
      between: between(360, 1920)
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
      if (!this.$v.width.$error && !this.$v.height.$error) {
        [this.width, this.height] = [this.height, this.width];
      }
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
</style>
