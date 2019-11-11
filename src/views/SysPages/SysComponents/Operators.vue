<template>
  <div class="sys-operators"
       v-loading="loading">
    <div class="search_add">
      <span>快速查询：</span>
      <el-input v-model="search"
                placeholder="请根据管理员姓名"
                style="width:30%"></el-input>
      <el-button @click="searchItem"
                 type="primary"
                 style="margin:20px">查询</el-button>
      <el-button @click="dialogOpen('new')"
                 type="primary"
                 style="float:right;margin:20px">新增人员</el-button>
    </div>
    <el-table :data="tabledata">
      <el-table-column type="index"
                       label="编号">
      </el-table-column>
      <el-table-column prop="admin_name"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="admin_username"
                       label="用户名">
      </el-table-column>
      <el-table-column prop="admin_password"
                       label="密码">
      </el-table-column>
      <el-table-column prop="admin_sex"
                       label="性别">
      </el-table-column>
      <el-table-column prop="admin_type"
                       label="身份类型">
        <template slot-scope="scope">
          {{scope.row.admin_type === '1'? '操作员': '管理员'}}
        </template>
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

    <el-dialog title="新增人员"
               :visible.sync="addWindow"
               :before-close="cancelAdd">
      <el-form :model="form"
               ref="form"
               label-width='100px'
               label-position='right'
               v-if="addWindow">
        <el-form-item prop="adminName"
                      :rules="rules"
                      label="姓名">
          <el-input v-model="form.adminName"
                    placeholder="请输入姓名"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item prop="adminUsername"
                      label="用户名"
                      :rules="rules">
          <el-input v-model="form.adminUsername"
                    placeholder="请输入用户名"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item prop="adminPassword"
                      label="密码"
                      :rules="rules">
          <el-input v-model="form.adminPassword"
                    placeholder="请输入密码"
                    style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="性别"
                      :rules="rules"
                      prop="adminSex">
          <el-select v-model="form.adminSex"
                     placeholder="请选择">
            <el-option label="女"
                       value="女">

            </el-option>
            <el-option label="男"
                       value="男">

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份类型"
                      :rules="rules"
                      prop="adminType">
          <el-select v-model="form.adminType"
                     placeholder="请选择">
            <el-option label="操作员"
                       value="1">

            </el-option>
            <el-option label="管理员"
                       value="2">

            </el-option>
          </el-select>
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
import { postAdmin, putAdmin, getAdmins, deleteAdmin } from '@/api/demo';

export default {
  data: () => ({
    search: '',
    tabledata: [],
    addtype: '',
    addWindow: false,
    rules: { required: true, message: '该选项不得为空' },
    form: {
      adminId: null,
      adminUsername: '',
      adminPassword: '',
      adminType: '',
      adminName: '',
      adminSex: ''
    },

  }),
  methods: {
    async getTableData(data) {
      this.loading = true;
      this.tabledata = await getAdmins(data);
      this.loading = false;
    },
    dialogOpen(type, index) {
      this.addWindow = true;
      this.addtype = type;
      if (type === 'modify') {
        this.form.adminId = this.tabledata[index].admin_id;
        this.form.adminPassword = this.tabledata[index].admin_password;
        this.form.adminUsername = this.tabledata[index].admin_username;
        this.form.adminType = this.tabledata[index].admin_type;
        this.form.adminName = this.tabledata[index].admin_name;
        this.form.adminSex = this.tabledata[index].admin_sex;
      }
    },
    submitForm(addtype) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (addtype === 'new') {
            postAdmin(this.form);
          }
          if (addtype === 'modify') {
            putAdmin(this.form.adminId, this.form);
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
    searchItem() {
      this.getTableData({ adminName: this.search });
    },
    cancelAdd() {
      this.addWindow = false;
      this.form = {
        adminId: null,
        adminUsername: '',
        adminPassword: '',
        adminType: '',
        adminName: '',
        adminSex: ''
      };
    },
    deleteRecord(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteAdmin(this.tabledata[index].admin_id);
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
  },
  created() {
    this.getTableData();
  }
};
</script>
