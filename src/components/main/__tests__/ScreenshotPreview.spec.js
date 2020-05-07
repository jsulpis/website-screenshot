import { mount } from "@vue/test-utils";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";

describe("ScreenshotPreview", () => {
  it("should fix the screenshot height on small screens", () => {
    global.innerWidth = 360;

    const wrapper = mount(ScreenshotPreview);

    expect(wrapper.vm.$data.screenshotHeight).toBe(180);
  });
});
