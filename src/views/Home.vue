<template>
  <div class="home">
    <div class="login">
      <div class="title">
        登陆
      </div>
      <el-input v-model="username"
                placeholder="请输入用户名"></el-input>
      <el-input v-model="password"
                placeholder="请输入密码"
                show-password
                clearable></el-input>
      <el-button type="primary"
                 class="ensure"
                 @click="login">登陆</el-button>
      <p v-show="wrong"
         style="color:red;margin-top: 60px">用户名或密码错误(或为空)，请重新输入</p>
    </div>
  </div>
</template>

<script src='./Home.js'>

</script>

<style lang="stylus" scoped>
.home
  width 1920px
  height 100vh
  position relative
  font-size 20px

.login
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)

.title
  text-align center
  font-weight 800

.el-input
  display block
  margin 20px 0
  width 400px

.ensure
  position absolute
  left 50%
  transform translateX(-50%)
</style>

