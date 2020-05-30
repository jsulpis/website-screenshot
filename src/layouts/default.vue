<template>
  <div class="flex flex-col">
    <main class="flex justify-center flex-grow transition-colors duration-150 bg-default">
      <nuxt class="container h-full mx-auto" />
    </main>
    <app-footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppFooter from "@/components/base/AppFooter.vue";
import MetaInfoBuilder from "@/utils/MetaInfoBuilder";

export default Vue.extend({
  head() {
    let routeName = "index";
    if (!!this.$route.name) {
      routeName = this.$route.name.split("_")[0];
    }
    // @ts-ignore
    const i18nSeo = this.$nuxtI18nSeo();

    const customHead = new MetaInfoBuilder()
      // @ts-ignore
      .title(this.$t(routeName + ".title"))
      // @ts-ignore
      .description(this.$t(routeName + ".description"))
      .url(process.env.BASE_URL + this.$route.path)
      .imageUrl(process.env.BASE_URL + "/og-image.png")
      .type("website")
      .twitterCard("summary_large_image")
      .build();

    return {
      title: customHead.title,
      htmlAttrs: {
        ...customHead.htmlAttrs,
        ...i18nSeo.htmlAttrs
      },
      meta: [...(i18nSeo.meta || []), ...(customHead.meta || [])],
      link: [...(i18nSeo.link || []), ...(customHead.link || [])]
    };
  },
  components: {
    AppFooter
  }
});
</script>
