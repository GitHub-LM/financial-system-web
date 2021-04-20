<template>
  <!-- 导出审批单 -->
  <el-dialog
    title="预览"
    :visible.sync="showPaperModal"
    width="60%"
    center
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div class="paper">
      <div class="paper-tit">报销审批单</div>
      <div class="paper-date">
        <div>
          <span>附单据 </span> <span style="margin-left: 25px">张</span>
        </div>
        <div>
          <span>年</span>
          <span style="margin: 0 40px">月</span>
          <span>日</span>
        </div>
      </div>
      <div class="paper-cont">
        <el-row>
          <el-col :span="4">事由</el-col>
          <el-col :span="10"></el-col>
          <el-col :span="3">经办人</el-col>
          <el-col :span="7"></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">金额(大写)</el-col>
          <el-col :span="20"></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">部门领导签批</el-col>
          <el-col :span="8"></el-col>
          <el-col :span="4">主管副总签批</el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">总经理签批</el-col>
          <el-col :span="20"></el-col>
        </el-row>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDownloadImg">下 载</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showPaperModal: {
      type: Boolean,
      default: false,
    },
    paperData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    handleCancel() {
      this.$emit("hideModal");
    },
    handleDownloadImg() {
      console.log(this.paperData);
    },
  },
};
</script>

<style lang="scss" scoped>
.paper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  &-tit {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
  }
  &-date {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  &-cont {
    display: flex;
    flex-direction: column;
    border: 2px solid #000000;
    div {
      height: 60px;
      line-height: 60px;
    }
    div:not(last-child) {
      border-bottom: 1px solid #000000;
    }
    .el-col-4,
    .el-col-3 {
      text-align: center;
    }
    .el-col {
      border-left: 1px solid #000000;
      border-right: 1px solid #000000;
    }
  }
}
</style>