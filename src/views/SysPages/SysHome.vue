<template>
  <div class="home">
    <div class="home-title">
      <span class="sysname">体育赛事管理系统</span>
      <span class="opername">{{userData.admin_name}}</span>
      <el-button type="text"
                 class="exit"
                 @click="toHomepage()">退出</el-button>
    </div>
    <div class="home-content">
      <el-container>
        <el-aside width="200px"
                  style="background-color: #ccc">
          <el-menu default-active="1">
            <el-menu-item index="1"
                          @click="toManagement('projects')">
              <template slot="title">
                项目管理</template>
            </el-menu-item>
            <el-menu-item index="2"
                          @click="toManagement('schedules')">
              <template slot="title">
                比赛项目</template>
            </el-menu-item>
            <el-menu-item index="3"
                          @click="toManagement('records')">
              <template slot="title">
                参赛记录</template>
            </el-menu-item>
            <el-menu-item index="4"
                          @click="toManagement('players')">
              <template slot="title">
                运动员管理</template>
            </el-menu-item>
            <el-menu-item index="5"
                          v-if="userData.admin_type === '2'"
                          @click="toManagement('operators')">
              <template slot="title">
                操作员管理
              </template>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-container>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: ''
  }),
  computed: {
    userData() {
      return this.$store.state.userData;
    }
  },
  methods: {
    toManagement(child) {
      this.$router.push(`/sys/${child}`);
    },
    toHomepage() {
      this.$router.push('/');
    }
  },
  mounted() {
    window.addEventListener('load', () => { // 滚动事件变为 scroll
      if (this.$route.path !== '/') { // /print 表示首页
        this.$router.replace('/'); // 切换到首页
      }
    });
  }
};

</script>


<style lang="stylus" scoped>
.home
  width 1920px
  font-size 20px
  position relative

.home-title
  width 1920px
  height 50px

.sysname
  margin-left 30px
  line-height 50px
  font-size 28px
  font-weight 800

.opername
  position absolute
  right 10%
  font-size 28px

.exit
  position absolute
  right 8%
  height 34px
  color #2c3e50

.tac
  width 200px

.el-menu
  border 0
  background-color #eee
  height 95vh
  text-align center
</style>
