<template>
  <!-- <div class="wrap"> -->
  <v-popup
    v-model="showPop"
    closeable
    close-icon="arrow-left"
    close-icon-position="top-left"
    position="right"
    class="popup-wrap popup-wrap2"
    @close="closePopup"
    :overlay-style="{ backgroundColor: 'rgb(255 255 255 / 0%)' }"
  >
    <h3 class="title">服务项目</h3>
    <div class="list-wrap">
      <v-list :finished="true">
        <v-cell
          class="item im_hover_1"
          v-for="(item, index) in list"
          :key="item.item_id"
          :title="item.item_name"
          @click="onChangeService(index)"
        >
          <!-- <v-icon
            v-show="activeIndex == index"
            name="success"
            class="icon"
            size="20px"
          /> -->
          <i class="el-icon-check im_icon_1" v-show="activeIndex == index"></i>
        </v-cell>
      </v-list>
    </div>
    <div class="fixed-btn padding border-box">
      <!-- <a
        class="weui-btn weui-btn_block weui-btn_primary padding"
        @click.stop="onConfirm"
        >确定</a
      > -->
      <el-button type="primary" class="im_btn_1" @click="onConfirm"
        >确定</el-button
      >
    </div>
  </v-popup>

  <!--  </div> -->
</template>

<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
//import Header from 'com/header'
import { mapState } from "vuex";
import { Popup, List, Cell, Icon } from "vant";
import { getServiceItemList as getServiceItemListApi } from "@/api/api";
export default {
  name: "SelectService",
  components: {
    vPopup: Popup,
    vList: List,
    vCell: Cell,
    vIcon: Icon,
  },
  props: {
    title: {
      type: String,
      default: "mmm",
    },
    show: {
      type: Boolean,
      default: false,
    },
    /*list: {
      type:Array,
      default:[]
    }*/
  },
  data() {
    return {
      activeIndex: -1, //当前选中的服务项目索引
      showPop: false,
      list: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    /*showPop:{
      get(){
        return this.show
      },
      set(newValue){
        this.$emit('update:show',newValue)
      }
    }*/
  },
  methods: {
    getServiceItemList() {
      //获取服务项目列表
      this.$showLoading();
      getServiceItemListApi()
        .then((data) => {
          this.list = data.data;
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    onChangeService(index) {
      this.activeIndex = index;
    },
    onConfirm() {
      if (this.activeIndex < 0) {
        this.$message("请选择服务项目");
        return;
      }
      let serviceItem = this.list[this.activeIndex].item_name;
      let serviceId = this.list[this.activeIndex].item_id;
      this.$emit("confirm", serviceItem, serviceId);
      this.closePopup(serviceItem);
    },
    closePopup() {
      this.$emit("close");
    },
  },
  watch: {
    show: function(newValue) {
      console.log("show:", newValue);
      this.showPop = newValue;
      this.activeIndex = -1;
      if (this.showPop && this.list.length == 0) {
        this.getServiceItemList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 主色
@color-primary: #007cc3;
.padding {
  padding: 32px;
}
.popup-wrap {
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 100%;
  .title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    color: @color-primary;
    border-bottom: 1px solid #dbdbdb;
  }
  .list-wrap {
    flex: 1;
    overflow: auto;
    .item {
      font-size: 14px;
    }
  }
}
.popup-wrap2 {
  width: 30% !important;
}
.im_btn_1 {
  width: 100%;
}
.im_icon_1 {
  font-size: 20px;
  font-weight: bold;
  color: @color-primary;
}
.im_hover_1 {
  &:hover {
    background-color: #e8e8e8;
  }
}
.icon {
  color: @color-primary;
}
</style>
