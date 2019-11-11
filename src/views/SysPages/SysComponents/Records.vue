<template>
  <div class="sys_record"
       v-loading="loading">
    <div class="search_add">
      <span>快速查询：</span>
      <el-input v-model="search"
                placeholder="请根据运动员姓名，运动员编号或赛程名称"
                style="width:30%"></el-input>
      <el-button @click="searchItem"
                 type="primary"
                 style="margin:20px">查询</el-button>
      <el-button @click="createRecord"
                 type="primary"
                 style="float:right;margin:20px">新建项目</el-button>
    </div>
    <el-table :data="tabledata">
      <el-table-column type="index"
                       label="编号">
      </el-table-column>
      <el-table-column prop="plog_schedulename"
                       label="比赛项目">
      </el-table-column>
      <el-table-column prop="plog_scheduledate"
                       label="比赛日期">
      </el-table-column>
      <el-table-column prop="plog_playername"
                       label="运动员姓名">
      </el-table-column>
      <el-table-column prop="plog_playernumber"
                       label="运动员编号">
      </el-table-column>
      <el-table-column prop="plog_score"
                       label="成绩">
      </el-table-column>
      <el-table-column prop="plog_adminname"
                       label="登记人">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="openaddWindow('score',scope.$index)"
                     type="text"
                     style="margin-right:10px">登记成绩</el-button>
          <el-button @click="deleteRecord(scope.$index)"
                     type="text"
                     style="margin-right:10px">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加参赛记录，成绩"
               :visible.sync="addWindow"
               :before-close="cancelAdd">
      <el-form :rules="rules"
               :model="addScoreForm"
               ref="addScoreForm"
               v-if="addType === 'score'"
               label-width="100px"
               label-position="right">
        <el-form-item label="赛程">
          {{tabledata[selectIndex].plog_schedulename}}
        </el-form-item>
        <el-form-item label="运动员编号">
          {{tabledata[selectIndex].plog_playernumber}}
        </el-form-item>
        <el-form-item label="运动员姓名">
          {{tabledata[selectIndex].plog_playername}}
        </el-form-item>
        <el-form-item label="成绩"
                      prop="plogScore"
                      :rules="rules">
          <el-input v-model.number="addScoreForm.plogScore"
                    style="width:30%"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="addnewForm"
               ref="addnewForm"
               v-if="addType === 'new'">
        <el-form-item label="赛程"
                      :rules="rules"
                      prop="plogScheduleid">
          <el-select v-model="addnewForm.plogScheduleid"
                     placeholder="请选择">
            <el-option v-for="(schedule,index) in schedules"
                       :label="schedule.schedule_name"
                       :value="schedule.schedule_id"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运动员"
                      :rules="rules"
                      prop="plogPlayerid">
          <el-select v-model="addnewForm.plogPlayerid"
                     placeholder="请选择">
            <el-option v-for="(player,index) in players"
                       :label="`${player.num}-${player.name}`"
                       :value="player.id"
                       :key="index">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary"
                   @click="add(addtype)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecords,
  getSchedules,
  getPlayers,
  putRecord,
  postRecord,
  deleteRecord
}
  from '@/api/demo';

export default {
  data: () => ({
    search: '',
    tabledata: [],
    addtype: '',
    addWindow: false,
    selectIndex: 0,
    addType: '',
    addScoreForm: {
      plogId: 0,
      plogScheduleid: 0,
      plogPlayerid: 0,
      plogScore: '',
      plogAdminid: 0
    },
    addnewForm: {
      plogScheduleid: null,
      plogPlayerid: null,
      plogScore: -1,
      plogAdminid: null
    },
    schedules: [],
    players: [],
    rules: { required: true, message: '该选项不得为空' },
    loading: true
  }),
  async  created() {
    this.loading = true;
    this.tabledata = await getRecords();
    this.schedules = await getSchedules();
    this.loading = false;

    const schedulesDate = {};
    this.schedules.forEach((el) => {
      schedulesDate[el.schedule_name] = el.schedule_date;
    });
    this.tabledata = this.tabledata.map((el) => {
      if (el.plog_score === -1) {
        el.plog_score = '无';
      }
      el.plog_scheduledate = schedulesDate[el.plog_schedulename];
      return el;
    });
  },
  methods: {
    async getTableData(data) {
      this.loading = true;
      this.tabledata = await getRecords(data);
      this.schedules = await getSchedules();
      this.loading = false;
      const schedulesDate = {};
      this.schedules.forEach((el) => {
        schedulesDate[el.schedule_name] = el.schedule_date;
      });
      this.tabledata = this.tabledata.map((el) => {
        if (el.plog_score === -1) {
          el.plog_score = '无';
        }
        el.plog_scheduledate = schedulesDate[el.plog_schedulename];
        return el;
      });
    },


    async searchItem() {
      this.getTableData({
        plogSearch: this.search
      });
    },


    add(type) {
      if (type === 'score') {
        this.$refs.addScoreForm.validate(async (valid) => {
          if (valid) {
            putRecord(
              this.addScoreForm.plogId,
              this.addScoreForm
            );
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            return true;
          }
          return false;
        });
      }
      if (type === 'new') {
        this.$refs.addnewForm.validate(async (valid) => {
          if (valid) {
            postRecord(this.addnewForm);
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            return true;
          }
          return false;
        });
      }
      this.getTableData();
      this.cancelAdd();
    },

    async openaddWindow(type, index) {
      this.addWindow = true;
      if (type === 'new') {
        this.addType = 'new';
        this.loading = true;
        this.players = (await getPlayers()).map(item => ({
          num: item.player_number,
          name: item.player_name,
          id: item.player_id
        }));
        this.loading = false;
        this.addnewForm.plogAdminid = this.$store.state.userData.admin_id;
      }
      if (type === 'score') {
        this.addType = 'score';
        this.selectIndex = index;
        this.addScoreForm.plogId = this.tabledata[index].plog_id;
        // eslint-disable-next-line
        this.addScoreForm.plogScheduleid = this.tabledata[index]
          .plog_scheduleid;
        this.addScoreForm.plogPlayerid = this.tabledata[index]
          .plog_playerid;
        this.addScoreForm.plogAdminid = this.$store.state.userData.admin_id;
      }

      this.addtype = type;
    },

    cancelAdd() {
      this.addWindow = false;
      this.addType = '';
      this.addnewForm = {
        plogScheduleid: null,
        plogPlayerid: null,
        plogScore: -1,
        plogAdminid: null
      };
    },

    deleteRecord(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteRecord(this.tabledata[index].plog_id);
        this.getTableData();

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    createRecord() {
      this.openaddWindow('new');
    }

  },

};
</script>

<style lang="stylus" scoped></style>
