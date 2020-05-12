import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuelidate from "vuelidate";
import IndexPage from "@/components/main/IndexPage.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";

const localVue = createLocalVue();
localVue.use(Vuelidate);

describe("IndexPage", () => {
  let wrapper;
  const VALID_URL = "https://toto.com";
  const VALID_WIDTH = 1280;
  const VALID_HEIGHT = 800;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage, { localVue });
  });

  describe("url", () => {
    it("should not be in error if the url is valid", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      await wrapper.vm.$nextTick();

      expect(wrapper.find(WebsiteUrlInput).props("error")).toBe(false);
    });

    it("should be in error if the url is empty", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(WebsiteUrlInput).props("error")).toBe(true);
    });

    it("should be in error if the url is invalid", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "notAnUrl");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(WebsiteUrlInput).props("error")).toBe(true);
    });
  });

  describe("resolution", () => {
    describe("should be in error if the width", () => {
      const testWithInput = value => async () => {
        wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: value, height: VALID_HEIGHT });

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
        wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: value });

        await wrapper.vm.$nextTick();

        expect(wrapper.find(ViewportResolutionInput).props("heightError")).toBe(true);
      };

      it("is not defined", testWithInput(""));
      it("is not a number", testWithInput("123a"));
      it("is below 360", testWithInput(359));
      it("is above 1920", testWithInput(1921));
    });

    it("should not be in error if width and height are valid", async () => {
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });

      await wrapper.vm.$nextTick();

      expect(wrapper.find(ViewportResolutionInput).props("widthError")).toBe(false);
      expect(wrapper.find(ViewportResolutionInput).props("heightError")).toBe(false);
    });
  });

  describe("screenshot", () => {
    it("should display a placeholder image when mounted", () => {
      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src.startsWith("data:image/gif;base64,")).toBe(true);
    });

    it("should have a src updated with the form data when submitting", async () => {
      const url = VALID_URL;
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.find(WebsiteUrlInput).vm.$emit("input", url);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", resolution);
      await wrapper.vm.$nextTick();

      wrapper.find("form").trigger("submit");
      await wrapper.vm.$nextTick();

      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src.startsWith("data:image/gif;base64,")).toBe(false);
      expect(src).toContain(`url=${url}`);
      expect(src).toContain(`width=${resolution.width}`);
      expect(src).toContain(`height=${resolution.height}`);
    });

    it("should not update the src when submitting with errors", async () => {
      wrapper.find("form").trigger("submit"); // missing URL
      await wrapper.vm.$nextTick();

      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src.startsWith("data:image/gif;base64,")).toBe(true);
    });

    it("should reset the image when the resolution changes", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.find("form").trigger("submit"); // should disable the button

      // When
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: 1440, height: 900 });
      await wrapper.vm.$nextTick();

      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src.startsWith("data:image/gif;base64,")).toBe(true);
    });
  });

  describe("button", () => {
    it("should be disabled when submitting", async () => {
      wrapper.find("form").trigger("submit");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(SubmitButton).props("disabled")).toBe(true);
    });

    it("should be (re)enabled when the resolution changes", async () => {
      // Given
      wrapper.find(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.find("form").trigger("submit"); // should disable the button

      // When
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: 1440, height: 900 });
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.find(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be (re)enabled when the url changes", async () => {
      // Given
      wrapper.find(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.find("form").trigger("submit"); // should disable the button

      // When
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "https://other-valid-url.com");
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.find(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be disabled if dirty and any error", async () => {
      wrapper.find(WebsiteUrlInput).vm.$emit("input", "invalidUrl");
      await wrapper.vm.$nextTick();

      expect(wrapper.find(SubmitButton).props("disabled")).toBe(true);
    });
  });
});
