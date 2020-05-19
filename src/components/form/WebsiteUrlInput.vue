<template>
  <div class="text-center">
    <input
      :value="value"
      @change="$emit('input', $event.target.value)"
      type="text"
      name="url"
      :placeholder="$t('index.url.placeholder')"
      class="w-full mx-auto transform sm:w-2/3 form-control sm:scale-110"
      :class="{ 'form-control--error': error }"
    />
    <p class="mt-1 text-error" v-show="error">{{ $t("index.url.error") }}</p>
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
