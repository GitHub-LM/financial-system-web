<template>
  <!-- 导出审批单 -->
  <el-dialog
    :visible.sync="show"
    width="60%"
    center
    @close="handleCancel()"
  >
    <div class="paper" ref="imageDom">
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
          <el-col :span="4" class="bd-rig">事由</el-col>
          <el-col :span="10">{{ paperData.content }}</el-col>
          <el-col :span="3" class="bd-rig bd-left">经办人</el-col>
          <el-col :span="7">{{ paperData.approvalName || "" }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="bd-rig">金额(大写)</el-col>
          <el-col :span="20" class="dx">{{
            paperData.totalPrice | convertCurrencyFilters
          }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="bd-rig">部门领导签批</el-col>
          <el-col :span="8"></el-col>
          <el-col :span="4" class="bd-rig bd-left">主管副总签批</el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="bd-rig">总经理签批</el-col>
          <el-col :span="20"></el-col>
        </el-row>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="handleDownloadImg">{{
        loading ? "下 载 中" : "下 载"
      }}</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { convertCurrency } from "@/utils/index";
import html2canvas from "html2canvas";

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
    return {
      imgUrl: "",
      loading: false,
      show: false
    };
  },
  watch: {
    showPaperModal(show) {
      this.show = show
    },
  },
  filters: {
    convertCurrencyFilters(e) {
      return convertCurrency(e);
    },
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit("hideModal");
    },
    // 下载图片
    handleDownloadImg() {
      this.loading = true;
      html2canvas(this.$refs.imageDom).then((canvas) => {
        // 转成图片，生成图片地址
        this.imgUrl = canvas.toDataURL("image/png");
        //保存图片
        let alink = document.createElement("a");
        alink.href = this.imgUrl;
        alink.download = "报销审批单"; //图片名
        alink.click();
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.paper {
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &-tit {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    padding: 20px 0;
  }
  &-date {
    margin: 10px;
    display: flex;
    justify-content: space-between;
  }
  &-cont {
    display: flex;
    flex-direction: column;
    border: 1px solid #000000;
    border-bottom: 0;
    div {
      height: 80px;
      line-height: 80px;
    }
    div {
      border-bottom: 1px solid #000000;
    }
    .el-col-4,
    .el-col-3 {
      text-align: center;
    }
    .el-col-7 {
      text-align: center;
    }
    .el-col-10 {
      text-align: center;
      line-height: 80px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // display: -webkit-box;
      // -webkit-line-clamp: 5;
      // -webkit-box-orient: vertical;
    }
    .dx {
      text-align: center;
      letter-spacing: 20px;
    }
    .bd-left {
      border-left: 1px solid #000000;
    }
    .bd-rig {
      border-right: 1px solid #000000;
    }
  }
}
</style>