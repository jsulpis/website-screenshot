import { mount } from "@vue/test-utils";
import ScreenshotWindowInput from "@/components/form/ScreenshotWindowInput.vue";
import WindowNone from "@/components/form/windows/WindowNone.vue";
import WindowMacOs from "@/components/form/windows/WindowMacOs.vue";
import CheckBox from "@/components/form/CheckBox.vue";

describe("ScreenshotWindowInput", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ScreenshotWindowInput, { stubs: ["FontAwesomeIcon"] });
  });

  it("should emit the default value when mounted", () => {
    expect(wrapper.emitted("change")[0]).toBeTruthy();
  });

  it("should emit the value of the selected window", async () => {
    await wrapper.findComponent(WindowMacOs).trigger("click");
    expect(wrapper.emitted("change")[1]).toEqual(["mac-os"]);

    await wrapper.findComponent(WindowNone).trigger("click");
    expect(wrapper.emitted("change")[2]).toEqual(["none"]);
  });

  it("should have a visual indicator of the selected value", async () => {
    await wrapper.findComponent(WindowNone).trigger("click");
    expect(wrapper.findComponent(WindowNone).findComponent(CheckBox).isVisible()).toBe(true);
  });
});
