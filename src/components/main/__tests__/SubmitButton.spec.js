import { mount } from "@vue/test-utils";
import SubmitButton from "@/components/main/SubmitButton.vue";

describe("SubmitButton", () => {
  it("should display a spinner when submitting", async () => {
    const wrapper = mount(SubmitButton);

    wrapper.setProps({ loading: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#spinner").isVisible()).toBe(true);
  });

  it("should display a text when not submitting", async () => {
    const wrapper = mount(SubmitButton);

    wrapper.setProps({ loading: false });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("#spinner").exists()).toBeFalsy();
    expect(wrapper.find("button").text()).toBeTruthy();
  });
});
