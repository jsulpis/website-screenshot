import { mount } from "@vue/test-utils";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";

describe("WebsiteUrlInput", () => {
  it("should display an error message if invalid", async () => {
    const wrapper = mount(WebsiteUrlInput);

    wrapper.setProps({ error: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-error").isVisible()).toBe(true);
  });

  it("should not display an error message if valid", async () => {
    const wrapper = mount(WebsiteUrlInput);

    wrapper.setProps({ error: false });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-error").isVisible()).toBe(false);
  });
});
