import { mount } from "@vue/test-utils";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";

describe("ScreenshotShadowInput", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ScreenshotShadowInput, {
      stubs: ["FontAwesomeIcon"]
    });
  });

  it("should emit the value of the selected shadow", async () => {
    await wrapper.find(".shadow-small").trigger("click");
    expect(wrapper.emitted("input")[0]).toEqual(["small"]);

    await wrapper.find(".shadow-medium").trigger("click");
    expect(wrapper.emitted("input")[1]).toEqual(["medium"]);
  });

  it("should have a visual indicator of the selected value", async () => {
    await wrapper.find(".shadow-small").trigger("click");

    expect(wrapper.find(".shadow-none > *").isVisible()).toBe(false);
    expect(wrapper.find(".shadow-small > *").isVisible()).toBe(true);
    expect(wrapper.find(".shadow-medium > *").isVisible()).toBe(false);
    expect(wrapper.find(".shadow-large > *").isVisible()).toBe(false);
  });
});
