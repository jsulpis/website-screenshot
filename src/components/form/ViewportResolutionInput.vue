<template>
  <div class="screen-dimensions">
    <h4 class="mb-4 text-left">
      {{ $t("index.screen-dimensions") }}
    </h4>
    <p class="p-1 text-sm border rounded opacity-90 bg-surface">
      <span class="font-bold">Note: </span>{{ $t("index.screen-note") }}
    </p>
    <ViewportResolutionPresets @change="updateDataFromPreset($event)" />
    <ul>
      <li :class="{ 'form-input--error': $v.width.$error }">
        <div class="inline-block">
          <label for="width" class="block">{{ $t("index.width") }}</label>
          <input
            v-model.lazy.number="$v.width.$model"
            type="number"
            name="width"
            id="width"
            placeholder="1440"
            class="w-24 form-control"
          />
          <span class="mr-2 text-sm opacity-50">px</span>
        </div>
        <p v-show="$v.width.$error" class="width-error">{{ $t("index.error", ["10", "20"]) }}</p>
      </li>

      <li :class="{ 'form-input--error': $v.height.$error }">
        <div class="inline-block">
          <label for="height" class="block">{{ $t("index.height") }}</label>
          <input
            v-model.lazy.number="$v.height.$model"
            type="number"
            name="height"
            id="height"
            placeholder="900"
            class="w-24 form-control"
          />
          <span class="mr-2 text-sm opacity-50">px</span>
        </div>
        <p v-show="$v.height.$error" class="height-error">{{ $t("index.error", ["10", "20"]) }}</p>
      </li>
    </ul>
    <p>{{ width }} x {{ height }}</p>
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
      if (!this.$v.width.$error) {
        this.$emit("width", this.width);
      }
    },
    height() {
      if (!this.$v.height.$error) {
        this.$emit("height", this.height);
      }
    }
  },
  methods: {
    updateDataFromPreset(event) {
      const [width, height] = event.split("x");
      this.width = +width;
      this.height = +height;
    }
  }
};
</script>

<style lang="scss">
.screen-dimensions {
  @apply w-1/2;

  label {
    @apply opacity-75 text-sm mb-1;
  }

  li {
    @apply text-left mb-3;

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
