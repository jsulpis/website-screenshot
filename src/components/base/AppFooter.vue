<template>
  <footer class="relative py-6 text-sm bg-accent">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-end justify-evenly">
        <app-lang-select class="mb-2" />
        <app-theme-select class="mb-2" />
        <div class="w-full px-4 text-center sm:w-auto">
          <ul class="list-unstyled">
            <li>
              <footer-link href="https://github.com/jsulpis/website-screenshot">
                {{ $t("footer.star-on-github") }}
              </footer-link>
            </li>
            <li>
              <footer-link href="https://github.com/jsulpis/website-screenshot/blob/master/LICENSE">
                {{ $t("footer.license") }}
              </footer-link>
            </li>
          </ul>
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
