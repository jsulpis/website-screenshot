import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import IndexPage from "@/components/main/IndexPage.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import Vuelidate from "vuelidate";

const localVue = createLocalVue();
localVue.use(Vuelidate);

describe("IndexPage", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage, { localVue });
  });

  describe("url", () => {
    it("should be in error if empty", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(WebsiteUrlInput).props("error")).toBe(true);
    });

    it("should be in error if invalid url", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "notAnUrl");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(WebsiteUrlInput).props("error")).toBe(true);
    });
  });

  describe("resolution", () => {
    describe("should be in error if the width", () => {
      const testWithInput = value => async () => {
        wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: value, height: 800 });

        await wrapper.vm.$nextTick();

        expect(wrapper.find(ViewportResolutionInput).props("widthError")).toBe(true);
      };

      it("is not defined", testWithInput(""));
      it("is not a number", testWithInput("123a"));
      it("is below 360", testWithInput(359));
      it("is above 1920", testWithInput(1921));
    });

    describe("should be in error if the height", () => {
      const testWithInput = value => async () => {
        wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: 1280, height: value });

        await wrapper.vm.$nextTick();

        expect(wrapper.find(ViewportResolutionInput).props("heightError")).toBe(true);
      };

      it("is not defined", testWithInput(""));
      it("is not a number", testWithInput("123a"));
      it("is below 360", testWithInput(359));
      it("is above 1920", testWithInput(1921));
    });

    it("should not be in error if width and height are valid", async () => {
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: 1280, height: 800 });

      await wrapper.vm.$nextTick();

      expect(wrapper.find(ViewportResolutionInput).props("widthError")).toBe(false);
      expect(wrapper.find(ViewportResolutionInput).props("heightError")).toBe(false);
    });
  });

  it("should display a placeholder image when mounted", () => {
    const src = wrapper.find("img").element.src;

    expect(src.startsWith("data:image/gif;base64,")).toBe(true);
  });

  it("should change the source of the image using the data from the children when clicking on the button", async () => {
    const url = "https://toto.com";
    const resolution = { width: 1280, height: 800 };
    wrapper.find(WebsiteUrlInput).vm.$emit("url", url);
    wrapper.find(ViewportResolutionInput).vm.$emit("resolution", resolution);
    await wrapper.vm.$nextTick();

    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    const src = wrapper.find("img").element.src;

    expect(src.startsWith("data:image/gif;base64,")).toBe(false);
    expect(src).toContain(`url=${url}`);
    expect(src).toContain(`width=${resolution.width}`);
    expect(src).toContain(`height=${resolution.height}`);
  });

  it("should (re)enable the button when the resolution changes", async () => {
    // Give
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    // When
    wrapper.find(ViewportResolutionInput).vm.$emit("resolution", { width: 300, height: 300 });
    await wrapper.vm.$nextTick();

    // Then
    const src = wrapper.find("img").element.src;
    expect(wrapper.find("button").attributes("disabled")).toBeFalsy();
  });

  it("should (re)enable the button when the url changes", async () => {
    // Given
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    // When
    wrapper.find(WebsiteUrlInput).vm.$emit("url", "https://toto.com");
    await wrapper.vm.$nextTick();

    // Then
    const src = wrapper.find("img").element.src;
    expect(wrapper.find("button").attributes("disabled")).toBeFalsy();
  });

  it("should disable the button and display a spinner when submitting", async () => {
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toBeTruthy();
    expect(wrapper.find("#spinner").isVisible()).toBe(true);
  });
});
