<template>
  <el-footer>
    <span>
      Copyright ©
      {{ new Date().getFullYear() }}

      <a
        href="https://github.com/damiankoper/interior-design-ar/graphs/contributors"
        target="_blank"
        class="author"
      >
        Team
      </a>

      <a href="http://github.com/damiankoper" target="_blank" class="author">
        @damiankoper</a
      >
      <a
        href="http://github.com/leszekblazewski"
        target="_blank"
        class="author"
      >
        @leszekblazewski</a
      >
      <a href="http://github.com/dex1g" target="_blank" class="author">
        @dex1g</a
      >
      <a href="http://github.com/Bigoz005" target="_blank" class="author">
        @Bigoz005</a
      >
    </span>
    <span>Made with ❤️</span>
  </el-footer>
</template>

<style lang="scss" scoped>
.el-footer {
  height: 32px;
  background-color: white;
  display: flex;
  align-items: center;
  bottom: 0px;
  left: 0px;
  position: fixed;
  width: 100%;
  justify-content: space-between;

  a {
    display: initial;
    @media only screen and (max-width: 1200px) {
      &:not(:first-child) {
        display: none;
      }
    }
    @media only screen and (min-width: 1200px) {
      &:first-child {
        display: none;
      }
    }
  }
}
</style>
