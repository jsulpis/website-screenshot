import { mount } from "@vue/test-utils";
import ScreenshotBorderRadius from "@/components/form/ScreenshotBorderRadius.vue";

describe("ScreenshotBorderRadius", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ScreenshotBorderRadius, {
      stubs: ["FontAwesomeIcon"]
    });
  });

  it("should emit the value of the selected radius", async () => {
    await wrapper.find(".radius-preview:nth-of-type(2)").trigger("click");
    expect(wrapper.emitted("change")[1]).toEqual([4]);

    await wrapper.find(".radius-preview:nth-of-type(3)").trigger("click");
    expect(wrapper.emitted("change")[2]).toEqual([8]);
  });

  it("should emit its default value when mounted", () => {
    expect(wrapper.emitted("change")[0]).toBeTruthy();
  });

  it("should have a visual indicator of the selected value", async () => {
    await wrapper.find(".radius-preview:nth-of-type(2)").trigger("click");

    expect(wrapper.find(".radius-preview:nth-of-type(1) > *").isVisible()).toBe(false);
    expect(wrapper.find(".radius-preview:nth-of-type(2) > *").isVisible()).toBe(true);
    expect(wrapper.find(".radius-preview:nth-of-type(3) > *").isVisible()).toBe(false);
    expect(wrapper.find(".radius-preview:nth-of-type(4) > *").isVisible()).toBe(false);
  });
});
