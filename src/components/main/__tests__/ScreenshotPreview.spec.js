import { mount } from "@vue/test-utils";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";

describe("ScreenshotPreview", () => {
  it("should have a height of 300 on medium and large screens", () => {
    global.innerWidth = 1280;

    const wrapper = mount(ScreenshotPreview);

    expect(wrapper.vm.$data.screenshotHeight).toBe(300);
  });

  it("should have a height of 180 on medium and large screens", () => {
    global.innerWidth = 360;

    const wrapper = mount(ScreenshotPreview);

    expect(wrapper.vm.$data.screenshotHeight).toBe(180);
  });
});
