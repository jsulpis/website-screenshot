import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuelidate from "vuelidate";
import IndexPage from "@/components/main/IndexPage.vue";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import ScreenshotResolutionInput from "@/components/form/ScreenshotResolutionInput.vue";
import ScreenshotPreview from "@/components/main/ScreenshotPreview.vue";
import SubmitButton from "@/components/main/SubmitButton.vue";
import ScreenshotShadowInput from "@/components/form/ScreenshotShadowInput.vue";
import ScreenshotBorderRadiusInput from "@/components/form/ScreenshotBorderRadiusInput.vue";
import ScreenshotWindowInput from "@/components/form/ScreenshotWindowInput.vue";
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
  const apiResponse = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  beforeEach(() => {
    wrapper = shallowMount(IndexPage, { localVue, stubs: ["FontAwesomeIcon"] });
    jest.resetAllMocks();
    fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(apiResponse) });
  });

  describe("url", () => {
    it("should not be in error if the url is valid", async () => {
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(WebsiteUrlInput).props("error")).toBe(false);
    });

    it("should be in error if the url is empty", async () => {
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", "");
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(WebsiteUrlInput).props("error")).toBe(true);
    });

    it("should be in error if the url is invalid", async () => {
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", "notAnUrl");
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(WebsiteUrlInput).props("error")).toBe(true);
    });
  });

  describe("resolution", () => {
    describe("should be in error if the width", () => {
      const testWithInput = value => async () => {
        wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: value, height: VALID_HEIGHT });

        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(ScreenshotResolutionInput).props("widthError")).toBe(true);
      };

      it("is not defined", testWithInput(""));
      it("is not a number", testWithInput("123a"));
      it("is below 360", testWithInput(359));
      it("is above 1920", testWithInput(1921));
    });

    describe("should be in error if the height", () => {
      const testWithInput = value => async () => {
        wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: value });

        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(ScreenshotResolutionInput).props("heightError")).toBe(true);
      };

      it("is not defined", testWithInput(""));
      it("is not a number", testWithInput("123a"));
      it("is below 360", testWithInput(359));
      it("is above 1920", testWithInput(1921));
    });

    it("should not be in error if width and height are valid", async () => {
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });

      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(ScreenshotResolutionInput).props("widthError")).toBe(false);
      expect(wrapper.findComponent(ScreenshotResolutionInput).props("heightError")).toBe(false);
    });
  });

  describe("shadow", () => {
    it("should be forwarded to the screenshot preview", async () => {
      const shadow = "small";
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("change", shadow);
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(ScreenshotPreview).props("shadow")).toBe(shadow);
    });
  });

  describe("radius", () => {
    it("should be forwarded to the screenshot preview", async () => {
      const radius = 8;
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", radius);
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(ScreenshotPreview).props("radius")).toBe(radius);
    });
  });

  describe("window", () => {
    it("should be forwarded to the screenshot preview", async () => {
      const window = "mac-os";
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", window);
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(ScreenshotPreview).props("window")).toBe(window);
    });
  });

  describe("screenshot", () => {
    it("should have no source when mounted", () => {
      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });

    it("should reset the source when the resolution changes", async () => {
      // Given a resolution and form submitted
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.find("form").trigger("submit");
      await flushPromises();

      // When the resolution changes
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: 1440, height: 900 });
      await wrapper.vm.$nextTick();

      // Then the source should be empty
      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });

    it("should reset the source when the shadow changes", async () => {
      // Given a resolution and form submitted
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("input", "small");
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // When the shadow changes
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("change", "medium");
      await wrapper.vm.$nextTick();

      // Then the source should be empty
      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");
      expect(src).toBeFalsy();
    });

    it("should reset the source when the radius changes", async () => {
      // Given a resolution and form submitted
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", 4);
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // When the shadow changes
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", 8);
      await wrapper.vm.$nextTick();

      // Then the source should be empty
      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");
      expect(src).toBeFalsy();
    });

    it("should reset the source when the window changes", async () => {
      // Given a resolution and form submitted
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", "mac-os");
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // When the shadow changes
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", "none");
      await wrapper.vm.$nextTick();

      // Then the source should be empty
      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");
      expect(src).toBeFalsy();
    });
  });

  describe("on submit", () => {
    it("should get the screenshot from the API using the form data", async () => {
      // Given form data
      const url = VALID_URL;
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      const shadow = "small";
      const radius = 8;
      const window = "mac-os";
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", url);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", resolution);
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("change", shadow);
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", radius);
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", window);

      // Given mock API defined in beforeEach

      // When submitting
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // Then
      const actualFetchArgument = fetch.mock.calls[0][0];
      expect(actualFetchArgument).toContain(`url=${url}`);
      expect(actualFetchArgument).toContain(`width=${resolution.width}`);
      expect(actualFetchArgument).toContain(`height=${resolution.height}`);
      expect(actualFetchArgument).toContain(`shadow=${shadow}`);
      expect(actualFetchArgument).toContain(`radius=${radius}`);
      expect(actualFetchArgument).toContain(`window=${window}`);

      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");
      expect(src).toBe("data:image/png;base64," + apiResponse);
    });

    it("should not update the src when submitting with errors", async () => {
      wrapper.find("form").trigger("submit"); // missing URL
      await wrapper.vm.$nextTick();

      const screenshotComponent = wrapper.findComponent(ScreenshotPreview);
      const src = screenshotComponent.props("src");

      expect(src).toBeFalsy();
    });

    it("should reactivate the button and display an error message if the request fails", async () => {
      // Given form data
      const url = VALID_URL;
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", url);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", resolution);

      // Given failing request
      fetch.mockResolvedValue({ ok: false });

      // When submitting
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
      expect(wrapper.find("#request-error").isVisible()).toBe(true);
    });

    it("should remove the error message", async () => {
      // Given error message displayed
      wrapper.vm.$data.displayRequestError = true;

      // Given form data
      const url = VALID_URL;
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", url);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", resolution);

      // When submitting
      await wrapper.find("form").trigger("submit");
      await flushPromises();

      // Then
      expect(wrapper.find("#request-error").exists()).toBe(false);
    });
  });

  describe("button", () => {
    it("should be disabled after submitting", async () => {
      // Given
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", resolution);
      await wrapper.vm.$nextTick();

      // When
      await wrapper.find("form").trigger("submit");

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);
    });

    it("should be (re)enabled when the resolution changes", async () => {
      // Given
      const resolution = { width: VALID_WIDTH, height: VALID_HEIGHT };
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", resolution);
      await wrapper.vm.$nextTick();

      await wrapper.find("form").trigger("submit"); // should disable the button
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);

      // When
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: 1440, height: 900 });
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be (re)enabled when the url changes", async () => {
      // Given
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      await wrapper.vm.$nextTick();

      await wrapper.find("form").trigger("submit"); // should disable the button
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);

      // When
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", "https://other-valid-url.com");
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be (re)enabled when the shadow changes", async () => {
      // Given
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("change", "small");
      await wrapper.vm.$nextTick();

      await wrapper.find("form").trigger("submit"); // should disable the button
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);

      // When
      wrapper.findComponent(ScreenshotShadowInput).vm.$emit("change", "medium");
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be (re)enabled when the radius changes", async () => {
      // Given
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", 4);
      await wrapper.vm.$nextTick();

      await wrapper.find("form").trigger("submit"); // should disable the button
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);

      // When
      wrapper.findComponent(ScreenshotBorderRadiusInput).vm.$emit("change", 8);
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be (re)enabled when the window changes", async () => {
      // Given
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", VALID_URL);
      wrapper.findComponent(ScreenshotResolutionInput).vm.$emit("input", { width: VALID_WIDTH, height: VALID_HEIGHT });
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", "mac-os");
      await wrapper.vm.$nextTick();

      await wrapper.find("form").trigger("submit"); // should disable the button
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);

      // When
      wrapper.findComponent(ScreenshotWindowInput).vm.$emit("change", "none");
      await wrapper.vm.$nextTick();

      // Then
      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(false);
    });

    it("should be disabled if dirty and any error", async () => {
      wrapper.findComponent(WebsiteUrlInput).vm.$emit("input", "invalidUrl");
      await wrapper.vm.$nextTick();

      expect(wrapper.findComponent(SubmitButton).props("disabled")).toBe(true);
    });
  });
});
