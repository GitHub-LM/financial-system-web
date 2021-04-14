<template>
  <!--  物资采购查询 -->
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item
        label="项目名称"
        prop="projectName"
      >
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="采购人"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          placeholder="请输入采购人名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="手机号 "
        prop="phone"
      >
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
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:procurement:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button>
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
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="项目名称"
        prop="projectName"
        :show-overflow-tooltip="true"
        width="200"
      />
      <el-table-column
        label="采购人"
        prop="name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="金额（¥）"
        prop="price"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="采购内容"
        prop="content"
        :show-overflow-tooltip="true"
        width="250"
      />
      <el-table-column
        label="采购内容(图片)"
        prop="content"
        :show-overflow-tooltip="true"
        width="120"
      >
        <template slot-scope="scope">
          <img
            style="width:100px;height:50px"
            :src="scope.row.contentImg"
            alt="采购内容(图片)"
          >
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="上报时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
          >审核</el-button>
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
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="项目名称"
              prop="projectName"
            >
              <el-input
                v-model="form.projectName"
                :disabled="true"
                placeholder="请输入项目名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="采购人"
              prop="name"
            >
              <el-input
                v-model="form.name"
                :disabled="true"
                placeholder="请输入采购人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="金额"
              prop="price"
            >
              <el-input
                v-model="form.price"
                :disabled="true"
                placeholder="请输入金额"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="大写金额"
              prop="amountPrice"
            >
              <el-input
                v-model="form.amountPrice"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
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
            <el-form-item
              label="上报时间"
              prop="createTime"
            >
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
            <el-form-item label="采购内容">
              <el-input
                v-model="form.content"
                type="textarea"
                :title="form.content"
                :disabled="true"
                placeholder="请输入采购内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="修改内容"
              prop="modifyContent"
            >
              <el-input
                v-model="form.modifyContent"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="修改原因">
              <el-input
                v-model="form.modifyReason"
                type="textarea"
                placeholder="请输入修改原因"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delRole, exportRole, dataScope, } from "@/api/system/role";
import { convertCurrency } from '@/utils/index'

export default {
  name: "Role",
  data () {
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
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        name: undefined,
        phone: undefined,
        createTime: '',
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 角色状态修改
    handleStatusChange (row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    changeValue (e) {
      return this.$set(this.form, 'amountPrice', convertCurrency(e))
    },
    /** 查询数据列表 */
    getList () {
      this.loading = true;
      this.$api.getProcurementList().then((response) => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    handleAdd () {
      let data = {
        projectName: 'projectName',
        name: 'name',
        content: '123123123',
        price: '123',
        amountPrice: '',
        reason: 'reason',
        // createTime: '2021-12-12 00:00:00',
      }
      this.$api.postProcurement(data).then(res => {
        console.log(res)
      })
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        projectName: undefined,
        name: undefined,
        phone: undefined,
        // content:undefined,
        // price: undefined,
        // price: undefined,
        // workTime: undefined,
        // contentImg: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.loading = true;
      this.$api.getProcurementList(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.id
      this.$api.getProcurementListById(id).then((response) => {
        this.form = response.data
        this.open = true;
        this.title = "修改";
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.$api.editProcurementListById(this.form).then((res) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            })
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除序号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delRole(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      let self = this
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        self.$api.exportProcurement(queryParams).then((res) => {
          self.download(res.msg);
        });
      })
    }
  }
};
</script>