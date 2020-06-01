require("dotenv").config();

const APP_TITLE = "Website Screenshot";

module.exports = {
  server: {
    host: "0.0.0.0" // Allow to connect other devices on the local network
  },
  /*
   ** Headers of the page
   */
  head: {
    // Only headers common to all pages and all languages.
    // The others are defined in the layout component.
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/dotenv",
    [
      // Doc: https://github.com/nuxt-community/fontawesome-module
      "@nuxtjs/fontawesome",
      {
        icons: {
          solid: [
            "faHeart",
            "faMoon",
            "faArrowsAltH",
            "faCheckCircle",
            "faExpand",
            "faLayerGroup",
            "faSquare",
            "faWindowMaximize",
            "faDownload"
          ],
          regular: ["faSun"]
        }
      }
    ],
    [
      // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
      "@nuxtjs/tailwindcss",
      {
        configPath: "../tailwind.config.js", // relative to the src folder
        cssPath: "@/assets/scss/tailwind.scss"
      }
    ],
    ["@nuxtjs/google-analytics", { id: process.env.GA_TRACKING_ID }],
    // Doc: https://github.com/nuxt-community/color-mode-module
    ["@nuxtjs/color-mode", { preference: "light" }],
    "@nuxtjs/pwa"
  ],
  purgeCSS: {
    whitelist: ["__nuxt", "__layout", "dark-mode", "font-semibold"],
    whitelistPatterns: [/page-(enter|leave)/, /svg.*/, /fa.*/] // Keep Fontawesome classes
  },
  pwa: {
    manifest: {
      name: APP_TITLE,
      short_name: APP_TITLE
    }
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      "nuxt-i18n",
      {
        locales: [
          { code: "en", iso: "en-US", name: "English" },
          { code: "fr", iso: "fr-FR", name: "Français" }
        ],
        defaultLocale: "en",
        baseUrl: process.env.BASE_URL,
        vueI18n: {
          fallbackLocale: "en",
          messages: {
            en: require("./locales/en.json"),
            fr: require("./locales/fr.json")
          }
        }
      }
    ]
  ],
  /*
   ** Plugins
   */
  plugins: [{ src: "~/plugins/vuelidate" }],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {}
  }
};
