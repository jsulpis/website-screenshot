<template>
  <div class="w-full sm:w-2/3">
    <h4>{{ $t("index.website-url") }}</h4>
    <input
      v-model.lazy="$v.url.$model"
      type="text"
      name="url"
      id="url"
      placeholder="https://..."
      class="w-full sm:w-1/2 form-control"
    />
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      url: ""
    };
  },
  validations: {
    url: {
      required
    }
  },
  watch: {
    url() {
      this.$emit("url", this.url);
    }
  }
};
</script>
