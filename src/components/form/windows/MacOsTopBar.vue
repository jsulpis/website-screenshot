<template>
  <div class="macos-window">
    <div class="macos-buttons">
      <span class="bg-red-500 macos-button"></span>
      <span class="bg-yellow-500 macos-button"></span>
      <span class="bg-green-500 macos-button"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.macos-window {
  display: flex;
  height: 24px;
}

.macos-buttons {
  @apply flex items-center h-full ml-3;
}

.macos-button {
  @apply inline-block w-3 h-3 mx-1 rounded-full;
}
</style>
