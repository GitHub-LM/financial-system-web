<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上报人" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入上报人名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号 " prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="手机号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上报时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column
        label="项目名称"
        prop="projectName"
        :show-overflow-tooltip="true"
        width="200"
      />

      <el-table-column
        label="金额（¥）"
        prop="totalPrice"
        align="center"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="工作内容"
        prop="content"
        :show-overflow-tooltip="true"
        width="250"
      />
      <el-table-column
        label="工作内容(图片)"
        prop="content"
        :show-overflow-tooltip="true"
        width="200"
      >
        <template slot-scope="scope">
          <img
            style="width: 50px; height: 50px; cursor: pointer"
            v-for="(item, index) in scope.row.imgArr"
            :key="index"
            :src="item"
            alt="工作内容(图片)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="上报人"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="手机号"
        prop="phone"
        align="center"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="上报时间"
        align="center"
        prop="createTime"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="150" align="center">
        <template slot-scope="scope">
          <span
            :class="[
              scope.row.status === '0'
                ? 'approveing'
                : scope.row.status === '1'
                ? 'approve-pass'
                : 'approve-refuse',
            ]"
            >{{
              scope.row.status === "0"
                ? "审核中"
                : scope.row.status === "1"
                ? "通过"
                : "驳回"
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
            >审核</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="form.projectName"
                :disabled="true"
                placeholder="请输入项目名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报人" prop="name">
              <el-input v-model="form.name" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="金额" prop="totalPrice">
              <el-input v-model="form.totalPrice" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大写金额">
              <el-input v-model="form.amountPrice" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input
                v-model="form.phone"
                type="input"
                :disabled="true"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报时间" prop="createTime">
              <el-input
                v-model="form.createTime"
                :title="form.createTime"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="工作内容">
              <el-input
                v-model="form.content"
                type="textarea"
                :title="form.content"
                :disabled="true"
                placeholder="请输入工作内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="修改内容" prop="modifyContent">
              <el-input
                v-model="form.modifyContent"
                type="textarea"
                placeholder="请输入修改内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修改原因" prop="modifyReason">
              <el-input
                v-model="form.modifyReason"
                type="textarea"
                placeholder="请输入修改原因"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row> </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePass(form)">通过</el-button>
        <el-button type="danger" @click="handleRefuse(form)">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delRole, exportRole, dataScope } from "@/api/system/role";
import { convertCurrency } from "@/utils/index";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        name: undefined,
        phone: undefined,
        createTime: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modifyContent: [
          { required: true, message: "修改内容不能为空", trigger: "blur" },
        ],
        modifyReason: [
          { required: true, message: "修改原因不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    changeValue(e) {
      return this.$set(this.form, "amountPrice", convertCurrency(e));
    },
    /** 查询工单上报数据列表 */
    getList() {
      this.loading = true;
      this.$api.getWorkOrderList().then((response) => {
        this.roleList = response.rows.map((item) => {
          return {
            ...item,
            imgArr: item.contentImg.length ? JSON.parse(item.contentImg) : [],
          };
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        projectName: undefined,
        name: undefined,
        phone: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loading = true;
      this.$api
        .getWorkOrderList(this.addDateRange(this.queryParams, this.dateRange))
        .then((response) => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.id;
      this.$api.getWorkOrderListById(id).then((response) => {
        this.form = response.data;
        this.$set(
          this.form,
          "amountPrice",
          convertCurrency(this.form.totalPrice)
        );
        this.open = true;
        this.title = "审核工单";
      });
    },
    /** 驳回 */
    handleRefuse(form) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const { modifyContent, modifyImg, modifyReason, id } = form;
          const params = {
            id,
            status: 2,
            modifyContent,
            modifyImg,
            modifyReason,
          };
          this.$api.editWorkOrderListById(params).then((res) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 通过 */
    handlePass(form) {
      const params = {
        id: form.id,
        status: 1,
      };
      this.$api.editWorkOrderListById(params).then((res) => {
        this.msgSuccess("操作成功");
        this.open = false;
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除序号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delRole(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      let self = this;
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有工单上报数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        self.$api.exportWorkOrder(queryParams).then((res) => {
          self.download(res.msg);
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.approveing {
  color: #d8af0c;
}
.approve-pass {
  color: #2e46dc;
}
.approve-refuse {
  color: #c91d1d;
}
</style>