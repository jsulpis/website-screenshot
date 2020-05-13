<template>
  <div class="w-full">
    <h4>{{ $t("index.url.title") }}</h4>
    <input
      :value="value"
      @change="$emit('input', $event.target.value)"
      type="text"
      name="url"
      placeholder="https://..."
      class="inline-block w-full mr-2 sm:w-1/2 form-control"
      :class="{ 'form-control--error': error }"
    />
    <p class="inline-block text-error" v-show="error">{{ $t("index.url.error") }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    error: {
      type: Boolean
    }
  }
};
</script>
