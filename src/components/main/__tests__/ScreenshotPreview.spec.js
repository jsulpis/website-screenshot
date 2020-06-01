import { mount } from "@vue/test-utils";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";

describe("ScreenshotPreview", () => {
  it("should display the image with the source if provided in props, as well as a download button", async () => {
    const wrapper = mount(ScreenshotPreview, { stubs: ["FontAwesomeIcon"] });
    const url = "https://come-url.com/image.png";
    wrapper.setProps({ src: url });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("img").attributes("src")).toBe(url);
    expect(wrapper.find("a").attributes("download")).toBe("preview.png");
    expect(wrapper.find("a").attributes("href")).toBe(url);
  });

  it("should display an information note when no source is provided in props (preview mode)", async () => {
    const wrapper = mount(ScreenshotPreview, { stubs: ["FontAwesomeIcon"] });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".preview-info").isVisible()).toBe(true);
  });

  it("should hide the information note when a source is provided in props", async () => {
    const wrapper = mount(ScreenshotPreview, { stubs: ["FontAwesomeIcon"] });
    const url = "https://come-url.com/image.png";
    wrapper.setProps({ src: url });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".preview-info").exists()).toBe(false);
  });

  it("should have a height of 500 on large screens", () => {
    global.innerWidth = 1280;

    const wrapper = mount(ScreenshotPreview, { stubs: ["FontAwesomeIcon"] });

    expect(wrapper.vm.$data.screenshotHeight).toBe(500);
  });

  it("should have a height of 180 on medium and small screens", () => {
    global.innerWidth = 360;

    const wrapper = mount(ScreenshotPreview, { stubs: ["FontAwesomeIcon"] });

    expect(wrapper.vm.$data.screenshotHeight).toBe(180);
  });
});
