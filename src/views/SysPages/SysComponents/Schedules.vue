<template>
  <div class="sys_shedule"
       v-loading="loading">
    <div class="search_add">
      <span>快速查询：</span>
      <el-input v-model="search"
                placeholder="请根据比赛名称"
                style="width:30%"></el-input>
      <el-button @click="searchItem"
                 type="primary"
                 style="margin:20px">查询</el-button>
      <el-button @click="dialogOpen('new')"
                 type="primary"
                 style="float:right;margin:20px">新增赛程</el-button>
    </div>
    <el-table :data="tabledata">

      <el-table-column prop="schedule_date"
                       label="日期">
      </el-table-column>
      <el-table-column prop="schedule_name"
                       label="名称">
      </el-table-column>
      <el-table-column prop="schedule_itemname"
                       label="项目类型">
      </el-table-column>
      <el-table-column prop="schedule_starttime"
                       label="开始时间">
      </el-table-column>
      <el-table-column prop="schedule_endtime"
                       label="结束时间">
      </el-table-column>
      <el-table-column prop="schedule_introduction"
                       label="说明">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="dialogOpen('modify',scope.$index)"
                     type="text"
                     style="margin-right:10px">修改</el-button>
          <el-button @click="deleteRecord(scope.$index)"
                     type="text"
                     style="margin-right:10px">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增或修改赛程"
               :visible.sync="addWindow"
               :before-close="cancelAdd">
      <el-form :model="form"
               ref="form"
               label-width='100px'
               label-position='right'
               v-if="addWindow">
        <el-form-item label="所属项目"
                      :rules="rules"
                      prop="scheduleItemid">
          <el-select v-model="form.scheduleItemid"
                     placeholder="请选择">
            <el-option v-for="scheduleItem in scheduleItems"
                       :key="scheduleItem.type_id"
                       :value="scheduleItem.type_id"
                       :label="scheduleItem.type_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="scheduleName"
                      label="名称"
                      :rules="rules">
          <el-input v-model="form.scheduleName"
                    placeholder="请输入名称"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item prop="scheduleDate"
                      :rules="rules"
                      label="日期">
          <el-date-picker type="date"
                          placeholder="请选择日期"
                          v-model="form.scheduleDate"
                          value-format="yyyy-MM-dd"
                          style="width: 30%;"></el-date-picker>
        </el-form-item>
        <el-form-item prop="scheduleStarttime"
                      label="开始时间"
                      :rules="rules">
          <el-time-select placeholder="选择时间"
                          v-model="form.scheduleStarttime"
                          style="width: 30%;"></el-time-select>
        </el-form-item>
        <el-form-item prop="scheduleEndtime"
                      :rules="rules"
                      label="结束时间">
          <el-time-select placeholder="选择时间"
                          v-model="form.scheduleEndtime"
                          style="width: 30%;"></el-time-select>
        </el-form-item>
        <el-form-item label="赛程说明"
                      :rules="rules"
                      prop="scheduleIntroduction">
          <el-input v-model="form.scheduleIntroduction"
                    placeholder="请输入赛程说明"
                    style="width:50%"
                    type="textarea">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm(addtype)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSchedules,
  postSchedule,
  putSchedule, deleteSchedule,
  getProjects
} from '@/api/demo';

export default {
  data: () => ({
    loading: true,
    search: '',
    addtype: '',
    addWindow: false,
    tabledata: [],
    form: {
      scheduleItemid: null, // 项目类型id
      // scheduleItemname: '',
      scheduleId: null,
      scheduleName: '',
      scheduleDate: '',
      scheduleStarttime: '',
      scheduleEndtime: '',
      scheduleIntroduction: ''
    },
    scheduleItems: [],
    rules: { required: true, message: '该选项不得为空' }
  }),
  async created() {
    this.loading = true;
    this.tabledata = (await getSchedules()).map((item) => {
      item.schedule_endtime = item.schedule_endtime.slice(0, 5);
      item.schedule_starttime = item.schedule_starttime.slice(0, 5);
      return item;
    });
    this.scheduleItems = await getProjects();
    this.loading = false;
  },
  methods: {
    async getTableData(data) {
      this.loading = true;
      this.tabledata = (await getSchedules(data)).map((item) => {
        item.schedule_endtime = item.schedule_endtime.slice(0, 5);
        item.schedule_starttime = item.schedule_starttime.slice(0, 5);
        return item;
      });
      this.loading = false;
    },
    searchItem() {
      this.getTableData({
        scheduleName: this.search
      });
    },
    async dialogOpen(type, index) {
      this.addWindow = true;
      this.addtype = type;
      this.loading = true;
      this.scheduleItems = await getProjects();
      if (type === 'modify') {
        this.form.scheduleItemid = this.tabledata[index].schedule_itemid;
        this.form.scheduleId = this.tabledata[index].schedule_id;
        this.form.scheduleName = this.tabledata[index].schedule_name;
        this.form.scheduleDate = this.tabledata[index].schedule_date;
        this.form.scheduleStarttime = this.tabledata[index].schedule_starttime;
        this.form.scheduleEndtime = this.tabledata[index].schedule_endtime;
        this.form.scheduleIntroduction =
          this.tabledata[index].schedule_introduction;
      }
      this.loading = false;
    },
    submitForm(addtype) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // this.form.playerBirthday = this.time(this.form.playerBirthday);
          if (addtype === 'new') {
            postSchedule(this.form);
          }
          if (addtype === 'modify') {
            putSchedule(this.form.scheduleId, this.form);
          }
          this.getTableData();
          this.cancelAdd();
          this.$message({
            type: 'success',
            message: '操作成功'
          });
        } else {
          return false;
        }
        return false;
      });
    },
    cancelAdd() {
      this.addWindow = false;
      this.form = {
        scheduleItemid: null, // 项目类型id
        scheduleId: null,
        scheduleName: '',
        scheduleDate: '',
        scheduleStarttime: '',
        scheduleEndtime: '',
        scheduleIntroduction: ''
      };
    },
    deleteRecord(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteSchedule(this.tabledata[index].schedule_id);
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
    }
  }
};
</script>
