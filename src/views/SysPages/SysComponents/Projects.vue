<template>
  <div class="sys_projects">
    <div class="search_add">
      <span>快速查询：</span>
      <el-input v-model="search"
                placeholder="请输入项目名称"
                style="width:30%"></el-input>
      <el-button @click="searchItem"
                 type="primary"
                 style="margin:20px">查询</el-button>
      <el-button @click="dialogOpen('new')"
                 type="primary"
                 style="float:right;margin:20px">新增项目类型</el-button>
    </div>
    <el-table :data="tabledata">
      <el-table-column type="index"
                       label="编号">
      </el-table-column>
      <el-table-column prop="type_name"
                       label="名称">
      </el-table-column>
      <el-table-column prop="type_introduction"
                       label="说明">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="dialogOpen('modify',scope.$index)"
                     type="text"
                     style="margin-right:10px">修改</el-button>
          <el-button @click="deleteProject(scope.$index)"
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
               label-width='50px'
               label-position='right'
               v-if="addWindow">
        <el-form-item prop="typeName"
                      :rules="rules"
                      label="名称">
          <el-input v-model="form.typeName"
                    placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item prop="typeIntroduction"
                      label="说明"
                      :rules="rules">
          <el-input v-model="form.typeIntroduction"
                    type="textarea"></el-input>
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
import { getProjects, postProject, putProject, deleteProject }
  from '@/api/demo';

export default {
  data: () => ({
    tabledata: [],
    addtype: '',
    search: '',
    addWindow: false,
    rules: { required: true, message: '该选项不得为空' },
    form: {
      typeId: null,
      typeName: '',
      typeIntroduction: ''
    }
  }),
  methods: {
    async getTableData(data) {
      this.loading = true;
      this.tabledata = await getProjects(data);
      this.loading = false;
    },
    submitForm(addtype) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (addtype === 'new') {
            postProject(this.form);
          }
          if (addtype === 'modify') {
            putProject(this.form.typeId, this.form);
          }
          this.getTableData();
          this.cancelAdd();
          this.$message({
            type: 'success',
            message: '操作成功',
            // duration: 100000
          });
        } else {
          return false;
        }
        return false;
      });
    },
    dialogOpen(type, index) {
      this.addWindow = true;
      this.addtype = type;
      if (type === 'modify') {
        this.form.typeId = this.tabledata[index].type_id;
        this.form.typeName = this.tabledata[index].type_name;
        this.form.typeIntroduction = this.tabledata[index].type_introduction;
      }
    },
    deleteProject(index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteProject(this.tabledata[index].type_id);
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
      this.getTableData({ typeName: this.search });
    },
    cancelAdd() {
      this.addWindow = false;
      this.form = {
        typeId: null,
        typeName: '',
        typeIntroduction: ''
      };
    },
  },
  async created() {
    this.loading = true;
    this.tabledata = await getProjects();
    this.loading = false;
  }
};
</script>

<style lang="stylus" scoped>
.el-dialog
  width 30%
</style>
