<!--
 * @Author:lemon
 * @Date: 2021-03-13 20:29:14
 * @LastEditTime: 2021-03-14 17:03:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ruoyi-ui\src\views\index.vue
-->
<template>
  <div class="app-container home">
    home
  </div>
</template>

<script>
export default {
  name: "index",
  data () {
    return {
      // 版本号
      version: "1.1.0",
    };
  },
  methods: {
    goTarget (href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
</style>

