import { mount } from "@vue/test-utils";
import AppLangSelect from "@/components/base/AppLangSelect";

const NuxtLink = {
  name: "nuxt-link",
  render: function (h) {
    return h("div", this.$slots.default);
  },
  props: ["to"]
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("AppLangSelect.vue", () => {
  const wrapper = mount(AppLangSelect, {
    mocks: {
      $i18n: {
        locales: [
          { code: "en", iso: "en-US", name: "English" },
          { code: "fr", iso: "fr-FR", name: "Français" }
        ],
        locale: "en"
      },
      switchLocalePath: jest.fn()
    },
    stubs: { NuxtLink }
  });

  it("contains two link with labels", () => {
    expect(wrapper.findAll("button").length).toBe(2);
    expect(wrapper.findAll("button").at(0).text()).toBe("En");
    expect(wrapper.findAll("button").at(1).text()).toBe("Fr");
  });

  it("contains one active button", () => {
    expect(wrapper.findAll("button.active").length).toBe(1);
  });
});
