import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuelidate from "vuelidate";
import IndexPage from "@/components/main/IndexPage.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import ViewportResolutionInput from "@/components/form/ViewportResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";
import fetch from "isomorphic-unfetch";
import flushPromises from "flush-promises";

jest.mock("isomorphic-unfetch");

const localVue = createLocalVue();
localVue.use(Vuelidate);

describe("IndexPage", () => {
  let wrapper;
  const VALID_URL = "https://toto.com";
  const VALID_WIDTH = 1280;
  const VALID_HEIGHT = 800;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage, { localVue });
    fetch.mockResolvedValue({ text: () => Promise.resolve("") });
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
    it("should have no source when mounted", () => {
      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });

    it("should reset the source when the resolution changes", async () => {
      // Given a resolution and form submitted
      wrapper.find(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.find("form").trigger("submit");

      // When the resolution changes
      wrapper.find(ViewportResolutionInput).vm.$emit("input", { width: 1440, height: 900 });
      await wrapper.vm.$nextTick();

      // Then the source should be empty
      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });
  });

  describe("on submit", () => {
    it("should get the screenshot from the API using the form data", async () => {
      // Given form data
      const url = VALID_URL;
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.find(WebsiteUrlInput).vm.$emit("input", url);
      wrapper.find(ViewportResolutionInput).vm.$emit("input", resolution);
      await wrapper.vm.$nextTick();

      // Given mock API
      const apiResponse = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      fetch.mockResolvedValue({ text: () => Promise.resolve(apiResponse) });

      // When submitting
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // Then
      const actualFetchArgument = fetch.mock.calls[0][0];
      expect(actualFetchArgument).toContain(`url=${url}`);
      expect(actualFetchArgument).toContain(`width=${resolution.width}`);
      expect(actualFetchArgument).toContain(`height=${resolution.height}`);

      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");
      expect(src).toBe("data:image/gif;base64," + apiResponse);
    });

    it("should not update the src when submitting with errors", async () => {
      wrapper.find("form").trigger("submit"); // missing URL
      await wrapper.vm.$nextTick();

      const screenshotComponent = wrapper.find(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });
  });

  describe("button", () => {
    it("should be disabled when submitting", async () => {
      await wrapper.find("form").trigger("submit");
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
