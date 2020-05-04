<template>
  <footer class="relative py-6 text-sm bg-accent">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-end">
        <div class="w-full text-base lg:w-6/12">
          <app-lang-select />
          <app-theme-select class="my-2" />
        </div>
        <div class="flex flex-wrap w-full px-4 lg:w-6/12 lg:text-left">
          <div class="w-full px-4 mt-3 lg:w-5/12">
            <ul class="list-unstyled">
              <li>
                <footer-link href="https://github.com/jsulpis/nuxtjs-template">
                  {{ $t("footer.star-on-github") }}
                </footer-link>
              </li>
              <li>
                <footer-link href="https://github.com/jsulpis/nuxtjs-template/blob/master/LICENSE">
                  {{ $t("footer.license") }}
                </footer-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="mt-3 mb-6 border-gray-400" />
      <div class="w-full mx-auto">
        <p class="py-1 text-sm">
          © {{ new Date().getFullYear() }} {{ $t("footer.made-with") }} <FontAwesomeIcon icon="heart" size="xs" />
          {{ $t("footer.by") }} <footer-link href="https://github.com/jsulpis">Julien Sulpis</footer-link>.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import AppThemeSelect from "@/components/base/AppThemeSelect.vue";
import AppLangSelect from "@/components/base/AppLangSelect.vue";

const FooterLink = {
  functional: true,
  render: (h, { data, children }) => (
    <a href={data.attrs.href} class="font-semibold hover:opacity-75">
      {children}
    </a>
  )
};

export default {
  components: {
    FooterLink,
    AppThemeSelect,
    AppLangSelect
  }
};
</script>
