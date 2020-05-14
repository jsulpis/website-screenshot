import { mount } from "@vue/test-utils";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";

describe("ScreenshotPreview", () => {
  it("should display a placeholder image when no url in props", () => {
    const wrapper = mount(ScreenshotPreview);

    const src = wrapper.find("img").attributes("src");

    expect(src.startsWith("data:image/png;base64")).toBe(true);
  });

  it("should display the image with the source if provided in props", async () => {
    const wrapper = mount(ScreenshotPreview);
    const url = "https://come-url.com/image.png";
    wrapper.setProps({ src: url });
    await wrapper.vm.$nextTick();

    const src = wrapper.find("img").attributes("src");

    expect(src).toBe(url);
  });

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
