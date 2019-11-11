<template>
  <div class="sys_players"
       v-loading="loading">
    <div class="search_add">
      <span>快速查询：</span>
      <el-input v-model="search"
                placeholder="请根据运动员姓名"
                style="width:30%"></el-input>
      <el-button @click="searchItem"
                 type="primary"
                 style="margin:20px">查询</el-button>
      <el-button @click="dialogOpen('new')"
                 type="primary"
                 style="float:right;margin:20px">新增人员</el-button>
    </div>
    <el-table :data="tabledata">
      <el-table-column prop="player_number"
                       label="运动员编号">
      </el-table-column>
      <el-table-column prop="player_name"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="player_sex"
                       label="性别">
      </el-table-column>
      <el-table-column prop="player_birthday"
                       label="生日">
      </el-table-column>
      <el-table-column prop="player_studentid"
                       label="学号">
      </el-table-column>
      <el-table-column prop="player_class"
                       label="班级">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="dialogOpen('modify',scope.$index)"
                     type="text"
                     style="margin-right:10px">修改</el-button>
          <el-button @click="deletePlayer(scope.$index)"
                     type="text"
                     style="margin-right:10px">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增或修改运动员"
               :visible.sync="addWindow"
               :before-close="cancelAdd">
      <el-form :model="form"
               ref="form"
               label-width='100px'
               label-position='right'
               v-if="addWindow">
        <el-form-item prop="playerNumber"
                      :rules="rules"
                      label="运动员编号">
          <el-input v-model="form.playerNumber"
                    placeholder="请输入编号"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item prop="playerName"
                      label="姓名"
                      :rules="rules">
          <el-input v-model="form.playerName"
                    placeholder="请输入姓名"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      :rules="rules"
                      prop="playerSex">
          <el-select v-model="form.playerSex"
                     placeholder="请选择">
            <el-option label="女"
                       value="女">

            </el-option>
            <el-option label="男"
                       value="男">

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="playerStudentid"
                      label="学号"
                      :rules="rules">
          <el-input v-model="form.playerStudentid"
                    placeholder="请输入学号"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="班级"
                      :rules="rules"
                      prop="playerClass">
          <el-input v-model="form.playerClass"
                    placeholder="请输入班级"
                    style="width:30%">
          </el-input>
        </el-form-item>
        <el-form-item prop="playerBirthday"
                      :rules="rules"
                      label="生日">
          <el-date-picker type="date"
                          placeholder="请选择日期"
                          v-model="form.playerBirthday"
                          style="width: 30%;"
                          value-format="yyyy-MM-dd"></el-date-picker>
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
import { postPlayer, putPlayer, deletePlayer, getPlayers } from '@/api/demo';

export default {
  data: () => ({
    search: '',
    addtype: '',
    addWindow: false,
    rules: { required: true, message: '该选项不得为空' },
    form: {
      playerName: '',
      playerSex: '',
      playerBirthday: '',
      playerClass: '',
      playerStudentid: '',
      playerNumber: '',
      playerId: null,
    },
    tabledata: [],
    loading: true
  }),
  methods: {
    dialogOpen(type, index) {
      this.addWindow = true;
      this.addtype = type;
      if (type === 'modify') {
        this.form.playerName = this.tabledata[index].player_name;
        this.form.playerId = this.tabledata[index].player_id;
        this.form.playerSex = this.tabledata[index].player_sex;
        this.form.playerBirthday = this.tabledata[index].player_birthday;
        this.form.playerClass = this.tabledata[index].player_class;
        this.form.playerStudentid = this.tabledata[index].player_studentid;
        this.form.playerNumber = this.tabledata[index].player_number;
      }
    },
    cancelAdd() {
      this.addWindow = false;
      this.form = {
        playerName: '',
        playerSex: '',
        playerBirthday: '',
        playerClass: '',
        playerStudentid: '',
        playerNumber: '',
        playerId: null,
      };
    },
    async submitForm(addtype) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (addtype === 'new') {
            postPlayer(this.form);
          }
          if (addtype === 'modify') {
            putPlayer(this.form.playerId, this.form);
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
    async deletePlayer(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deletePlayer(this.tabledata[index].player_id);
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
    searchItem() {
      this.getTableData({ playerName: this.search });
    },
    async getTableData(data) {
      this.loading = true;
      this.tabledata = await getPlayers(data);
      this.loading = false;
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
