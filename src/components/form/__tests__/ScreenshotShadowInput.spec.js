import { mount } from "@vue/test-utils";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";
import InfoBox from "@/components/form/InfoBox.vue";

describe("ScreenshotShadowInput", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ScreenshotShadowInput, {
      stubs: ["FontAwesomeIcon"]
    });
  });

  it("should emit the value of the selected shadow", async () => {
    await wrapper.find(".shadow-small").trigger("click");
    expect(wrapper.emitted("change")[1]).toEqual(["small"]);

    await wrapper.find(".shadow-medium").trigger("click");
    expect(wrapper.emitted("change")[2]).toEqual(["medium"]);
  });

  it("should emit its default value when mounted", () => {
    expect(wrapper.emitted("change")[0]).toBeTruthy();
  });

  it("should have a visual indicator of the selected value", async () => {
    await wrapper.find(".shadow-small").trigger("click");

    expect(wrapper.find(".shadow-none > *").exists()).toBe(false);
    expect(wrapper.find(".shadow-small > *").isVisible()).toBe(true);
    expect(wrapper.find(".shadow-medium > *").exists()).toBe(false);
    expect(wrapper.find(".shadow-large > *").exists()).toBe(false);
  });
});
