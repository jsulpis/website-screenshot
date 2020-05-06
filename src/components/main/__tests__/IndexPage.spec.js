import { shallowMount } from "@vue/test-utils";
import IndexPage from "@/components/main/IndexPage.vue";

describe("IndexPage", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage);
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

  it("should reset the image when the resolution changes", async () => {
    // Given
    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();

    // When
    wrapper.vm.$data.resolution = { width: 300, height: 300 };
    await wrapper.vm.$nextTick();

    // Then
    const src = wrapper.find("img").element.src;
    expect(src.startsWith("data:image/gif;base64,")).toBe(true);
  });

  it("should fix the screenshot height on small screens", () => {
    global.innerWidth = 360;

    const wrapper = shallowMount(IndexPage);

    expect(wrapper.vm.$data.screenshotHeight).toBe(180);
  });
});
