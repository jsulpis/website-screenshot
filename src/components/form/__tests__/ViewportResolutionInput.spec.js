import { mount, createLocalVue } from "@vue/test-utils";
import ScreenshotResolutionInput from "../ScreenshotResolutionInput.vue";
import ScreenshotResolutionPresets from "../ScreenshotResolutionPresets";
import Vuelidate from "vuelidate";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowsAltH);

const localVue = createLocalVue();
localVue.use(Vuelidate);
localVue.component("FontAwesomeIcon", FontAwesomeIcon);

describe("ScreenshotResolutionInput", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ScreenshotResolutionInput, {
      localVue
    });
    wrapper.findComponent(ScreenshotResolutionPresets).vm.$emit("change", "1440x900");
  });

  it("should send the default resolution to the parent when mounted", () => {
    expect(wrapper.emitted("input")[0]).toEqual([{ width: 1440, height: 900 }]);
  });

  it("should send the resolution to the parent when changed", async () => {
    // Given
    wrapper.find("input[name=width]").setValue(1280);
    wrapper.find("input[name=height]").setValue(800);

    // When
    wrapper.find("input[name=width]").trigger("blur");
    wrapper.find("input[name=height]").trigger("blur");
    await wrapper.vm.$nextTick();

    // Then
    // Check the third event: two are emitted when receiving the default preset, and two when changing the width and height
    expect(wrapper.emitted("input")[2]).toEqual([{ width: 1280, height: 800 }]);
  });

  it("should switch the aspect ratio when clicking on the arrows icon", async () => {
    wrapper.findComponent(FontAwesomeIcon).trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("input")[2]).toEqual([{ width: 900, height: 1440 }]);
  });

  it("should display an error if the width is invalid", async () => {
    wrapper.setProps({ widthError: true });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-error").isVisible()).toBe(true);
  });

  it("should display an error if the height is invalid", async () => {
    wrapper.setProps({ heightError: true });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-error").isVisible()).toBe(true);
  });

  it("should display no error if the width and the height are valid", async () => {
    wrapper.find("input[name=width]").setValue(1280);
    wrapper.find("input[name=height]").setValue(800);

    // When
    wrapper.find("input[name=width]").trigger("blur");
    wrapper.find("input[name=height]").trigger("blur");

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-error").isVisible()).toBe(false);
  });
});
