import { mount, createLocalVue } from "@vue/test-utils";
import WebsiteUrlInput from "@/components/form/WebsiteUrlInput.vue";
import Vuelidate from "vuelidate";

const localVue = createLocalVue();
localVue.use(Vuelidate);

describe("WebsiteUrlInput", () => {
  it("should send the url on blur event if valid", async () => {
    const wrapper = mount(WebsiteUrlInput, { localVue });
    const url = "https://toto.com";

    wrapper.find("input").setValue(url);
    wrapper.find("input").trigger("blur");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("url")[0]).toEqual([url]);
  });
});
