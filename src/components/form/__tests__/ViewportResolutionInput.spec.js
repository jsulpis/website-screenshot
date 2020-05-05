import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import ViewportResolutionInput from "../ViewportResolutionInput.vue";
import ViewportResolutionPresets from "../ViewportResolutionPresets";
import Vuelidate from "vuelidate";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowsAltH);

const localVue = createLocalVue();
localVue.use(Vuelidate);
localVue.component("FontAwesomeIcon", FontAwesomeIcon);

describe("ViewportResolutionInput", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ViewportResolutionInput, {
      localVue
    });
    wrapper.find(ViewportResolutionPresets).vm.$emit("change", "1440x900");
  });

  it("should send the default resolution to the parent when mounted", () => {
    expect(wrapper.emitted("resolution")[0]).toEqual([{ width: 1440, height: 900 }]);
  });

  it("should send the resolution to the parent when changed", async () => {
    // Given
    wrapper.find("#width").setValue(1280);
    wrapper.find("#height").setValue(800);

    // When
    wrapper.find("#width").trigger("blur");
    wrapper.find("#height").trigger("blur");
    await wrapper.vm.$nextTick();

    // Then
    // Check the third event: two are emitted when receiving the default preset, and two when changing the width and height
    expect(wrapper.emitted("resolution")[2]).toEqual([{ width: 1280, height: 800 }]);
  });

  it("should not send the resolution to the parent if changed with error", async () => {
    // Given
    wrapper.find("#width").setValue();
    wrapper.find("#height").setValue();

    // When
    wrapper.find("#width").trigger("blur");
    wrapper.find("#height").trigger("blur");
    await wrapper.vm.$nextTick();

    // Then
    expect(wrapper.emitted("resolution")[2]).toBeFalsy();
  });

  it("should display no error when mounted", async () => {
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#input-error").isVisible()).toBe(false);
  });

  it("should switch the aspect ratio when clicking on the arrows icon", async () => {
    wrapper.find(FontAwesomeIcon).trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("resolution")[2]).toEqual([{ width: 900, height: 1440 }]);
  });

  it("should not switch the aspect ratio if height is incorrect", async () => {
    wrapper.find("#height").setValue(10);
    wrapper.find("#height").trigger("blur");
    wrapper.find(FontAwesomeIcon).trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("resolution")[2]).toBeFalsy();
  });

  it("should not switch the aspect ratio if width is incorrect", async () => {
    wrapper.find("#width").setValue(10);
    wrapper.find("#width").trigger("blur");
    wrapper.find(FontAwesomeIcon).trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("resolution")[2]).toBeFalsy();
  });

  describe("should display an error if the width", () => {
    const testWithInput = value => async () => {
      wrapper.find("#width").setValue(value);
      wrapper.find("#width").trigger("blur");

      await wrapper.vm.$nextTick();

      expect(wrapper.find("#input-error").isVisible()).toBe(true);
    };

    it("is not defined", testWithInput(""));
    it("is not a number", testWithInput("123a"));
    it("is below 360", testWithInput(359));
    it("is above 1920", testWithInput(1921));
  });

  describe("should display an error if the height", () => {
    const testWithInput = value => async () => {
      wrapper.find("#height").setValue(value);
      wrapper.find("#height").trigger("blur");

      await wrapper.vm.$nextTick();

      expect(wrapper.find("#input-error").isVisible()).toBe(true);
    };

    it("is not defined", testWithInput(""));
    it("is not a number", testWithInput("123a"));
    it("is below 360", testWithInput(359));
    it("is above 1920", testWithInput(1921));
  });

  it("should display no error if valid width and valid height", async () => {
    wrapper.find("#width").setValue(1280);
    wrapper.find("#width").trigger("blur");

    wrapper.find("#height").setValue(800);
    wrapper.find("#height").trigger("blur");

    await wrapper.vm.$nextTick();

    expect(wrapper.find("#input-error").isVisible()).toBe(false);
  });
});
