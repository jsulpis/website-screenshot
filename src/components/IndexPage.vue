<template>
  <div class="flex flex-col items-center mt-16">
    <ViewportResolutionInput @resolution="resolution = $event" />

    <button class="my-3 text-white btn bg-primary-700">{{ $t("index.send") }}</button>

    <div class="w-3/4 mt-1 sm:w-1/2 xl:w-1/3">
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
