<template>
  <div class="preview">
    <div class="border bg-surface" :style="previewStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    resolution: {
      type: Object,
      default: {
        width: 0,
        height: 0
      }
    }
  },
  data() {
    return {
      previewStyle: {
        position: "absolute",
        top: "100%",
        left: "100%",
        bottom: "100%",
        right: "100%"
      }
    };
  },
  watch: {
    resolution() {
      const { width, height } = this.resolution;
      if (width > height) {
        const difference = ((width - height) / width) * 100;
        this.previewStyle.top = 0;
        this.previewStyle.bottom = difference + "%";
        this.previewStyle.left = 0;
        this.previewStyle.right = 0;
      } else {
        const difference = ((height - width) / height) * 100;
        this.previewStyle.top = 0;
        this.previewStyle.bottom = 0;
        this.previewStyle.left = difference / 2 + "%";
        this.previewStyle.right = difference / 2 + "%";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  padding-top: 100%;
  position: relative;
}
</style>
