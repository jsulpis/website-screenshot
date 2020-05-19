<template>
  <footer class="py-6 text-sm text-center bg-accent">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-center justify-around mx-auto lg:w-2/3">
        <app-lang-select class="w-full mb-2 sm:w-auto" />
        <app-theme-select class="w-full mb-2 sm:w-auto" />
        <footer-link class="block w-full mb-2 sm:w-auto" href="https://github.com/jsulpis/website-screenshot">
          {{ $t("footer.star-on-github") }}
        </footer-link>
      </div>
      <hr class="mt-3 mb-6 border-gray-400" />
      <div class="w-full mx-auto">
        <p class="py-1 text-sm">
          ©{{ new Date().getFullYear() }} {{ $t("footer.made-with") }} <FontAwesomeIcon icon="heart" size="xs" />
          {{ $t("footer.by") }} <footer-link href="https://github.com/jsulpis">Julien Sulpis</footer-link>
        </p>
        <p class="text-xs">
          {{ $t("footer.project-bootstrapped-with") }}
          <footer-link href="https://nuxtjs-template.netlify.app">{{ $t("footer.nuxt-template") }}</footer-link>
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
    <a href={data.attrs.href} class={`font-semibold hover:opacity-75 ${data.staticClass}`}>
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

<style scoped></style>
