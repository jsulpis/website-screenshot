import { mount } from "@vue/test-utils";
import IndexPage from "@/components/main/IndexPage.vue";

describe("IndexPage", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(IndexPage, { stubs: ["ViewportResolutionForm"] });
  });

  it("should display a placeholder image when mounted", () => {
    const src = wrapper.find("img").element.src;

    expect(src.startsWith("data:image/gif;base64,")).toBe(true);
  });

  it("should change the source of the image when clicking on the button", async () => {
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    const src = wrapper.find("img").element.src;

    expect(src.startsWith("data:image/gif;base64,")).toBe(false);
  });

  it("should reset the image and (re)enable the button when the resolution changes", async () => {
    // Given
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    // When
    wrapper.vm.$data.resolution = { width: 300, height: 300 };
    await wrapper.vm.$nextTick();

    // Then
    const src = wrapper.find("img").element.src;
    expect(wrapper.find("button").attributes("disabled")).toBeFalsy();
    expect(src.startsWith("data:image/gif;base64,")).toBe(true);
  });

  it("should disable the button and display a spinner when submitting", async () => {
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("button").attributes("disabled")).toBeTruthy();
    expect(wrapper.find("#spinner").isVisible()).toBe(true);
  });
});
