<template functional>
  <a :href="data.attrs.href" :class="`font-semibold hover:opacity-75 ${data.staticClass || ''}`">
    <slot />
  </a>
</template>
