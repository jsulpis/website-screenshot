import { mount } from "@vue/test-utils";
import ScreenshotResolutionPresets from "../ScreenshotResolutionPresets.vue";

describe("ScreenshotResolutionPresets", () => {
  it("should emit the resolution of the first preset when mounted", () => {
    const wrapper = mount(ScreenshotResolutionPresets);

    expect(wrapper.emitted().change[0]).toBeTruthy();
  });

  it("should emit the selected resolution", () => {
    const wrapper = mount(ScreenshotResolutionPresets);

    const options = wrapper.find("select").findAll("option");
    options.at(1).setSelected();

    expect(wrapper.emitted().change[1]).toEqual(["1280x800"]);
  });
});
