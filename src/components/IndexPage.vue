<template>
  <div class="mt-16">
    <ViewportResolutionInput @resolution="resolution = $event" />

    <p class="mt-3 text-center text-light">{{ resolution.width }} x {{ resolution.height }}</p>
    <div class="mx-auto mt-1 sm:w-1/2">
      <ScreenshotPreview :resolution="resolution" />
    </div>
  </div>
</template>

<script>
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/ScreenshotPreview.vue";

export default {
  components: {
    ViewportResolutionInput,
    ScreenshotPreview
  },
  data() {
    return {
      resolution: {}
    };
  }
};
</script>
