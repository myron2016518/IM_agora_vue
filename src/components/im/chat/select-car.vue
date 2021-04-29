<template>
  <div class="wrap">
    <!-- 品牌 -->
    <v-popup
      v-model="showCarBrandPop"
      closeable
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      class="popup-wrap"
      :style="{ width: '30%', height: '100%' }"
      :overlay-style="{ backgroundColor: 'rgb(255 255 255 / 0%)' }"
      @close="closePopup"
    >
      <h3 class="title">车辆品牌</h3>
      <div class="list-wrap">
        <!-- <h3 class="title" id="title">车辆品牌</h3> -->
        <v-list :finished="true">
          <div
            :id="brandIndex"
            v-for="(brandNameArr, brandIndex) in brandList"
            :key="brandIndex"
          >
            <v-cell-group :title="brandIndex">
              <v-cell
                class="item"
                v-for="item in brandNameArr"
                :key="item"
                :title="item"
                @click="onBrandChange(item)"
              >
              </v-cell>
            </v-cell-group>
          </div>
        </v-list>
      </div>
      <div class="letter-wrap">
        <ul>
          <li
            class="letter"
            v-for="(value, name) in brandList"
            :key="name"
            @click.self="jump(name)"
          >
            {{ name }}
          </li>
        </ul>
      </div>
    </v-popup>
    <!-- 车型 -->
    <v-popup
      v-model="showCarModelPop"
      closeable
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      class="popup-wrap"
      :style="{ width: '20%', height: '100%' }"
      :overlay-style="{ backgroundColor: 'rgb(255 255 255 / 0%)' }"
    >
      <h3 class="title">{{ brand }}</h3>
      <div class="list-wrap">
        <v-list :finished="true">
          <v-cell
            class="item"
            v-for="item in modelList"
            :key="item.models"
            :title="item.models"
            @click="onModelChange(item.models)"
          >
          </v-cell>
        </v-list>
      </div>
    </v-popup>
    <!-- 年款 -->
    <v-popup
      v-model="showCarYearPop"
      closeable
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      class="popup-wrap"
      :style="{ width: '20%', height: '100%' }"
      :overlay-style="{ backgroundColor: 'rgb(255 255 255 / 0%)' }"
    >
      <h3 class="title">{{ model }}</h3>
      <div class="list-wrap">
        <v-list :finished="true">
          <v-cell
            class="item"
            v-for="item in yearList"
            :key="item.year"
            :title="item.year"
            @click="onYearChange(item.year)"
          >
          </v-cell>
        </v-list>
      </div>
    </v-popup>
    <!-- 排量 -->
    <v-popup
      v-model="showCarDisplacementPop"
      closeable
      close-icon="arrow-left"
      close-icon-position="top-left"
      position="right"
      :style="{ width: '20%', height: '100%' }"
      :overlay-style="{ backgroundColor: 'rgb(255 255 255 / 0%)' }"
    >
      <div class="list-wrap">
        <h3 class="title">{{ displacement }}</h3>
        <v-list :finished="true">
          <v-cell
            v-for="item in displacementList"
            :key="item.displacement"
            :title="item.displacement"
            @click="onDisplacementChange(item.displacement)"
          >
          </v-cell>
        </v-list>
      </div>
    </v-popup>
  </div>
</template>

<script>
// @ts-nocheck
/* eslint-disable */
// @ts-ignore
//import Header from 'com/header'
import { mapState } from "vuex";
import { Popup, List, Cell, CellGroup } from "vant";
import { getCarInfoOptions } from "@/api/api";
const CAR_OPTION_TYPE = {
  BRAND: 1,
  MODEL: 2,
  YEAR: 3,
  DISPLACEMENT: 4,
};
export default {
  name: "SelectCar",
  components: {
    vPopup: Popup,
    vList: List,
    vCell: Cell,
    vCellGroup: CellGroup,
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
      default:function(){
        return []
      }
    }*/
  },
  data() {
    return {
      showCarBrandPop: false,
      showCarModelPop: false,
      showCarYearPop: false,
      showCarDisplacementPop: false,
      brandList: [], //车辆品牌列表
      modelList: [], //车型列表
      yearList: [], //年款列表
      displacementList: [], //排量列表
      brand: "", //车辆品牌
      model: "", //车型
      year: "", //年款
      displacement: "", //排量
    };
  },
  created() {},
  computed: {
    ...mapState(["userInfo"]),
    showPop: {
      get() {
        console.log("get");
        return this.show;
      },
      set(newValue) {
        console.log("set");
        this.$emit("update:show", newValue);
      },
    },
  },
  methods: {
    init() {
      this.showCarBrandPop = false;
      this.showCarModelPop = false;
      this.showCarYearPop = false;
      this.showCarDisplacementPop = false;
      this.modelList = []; //车型列表
      this.yearList = []; //年款列表
      this.displacementList = []; //排量列表
      this.brand = ""; //车辆品牌
      this.model = ""; //车型
      this.year = ""; //年款
      this.displacement = ""; //排量
    },
    closePopup() {
      this.$emit("close");
    },
    getCarInfoList(obj = {}) {
      //获取车辆品牌、车型、年款等
      this.$showLoading();
      let params = {
        option_type: obj.optionType,
      };
      if (obj.brand) {
        params.brand = obj.brand;
      }
      if (obj.model) {
        params.models = obj.model;
      }
      if (obj.year) {
        params.year = obj.year;
      }
      return getCarInfoOptions(params)
        .then((data) => {
          return Promise.resolve(data.data);
        })
        .finally(() => {
          this.$hideLoading();
        });
    },
    getBrandList() {
      this.getCarInfoList({ optionType: CAR_OPTION_TYPE.BRAND }).then(
        (data) => {
          this.transformBrandList(data);
        }
      );
    },
    onBrandChange(brand) {
      let param = {
        optionType: CAR_OPTION_TYPE.MODEL,
        brand,
      };
      this.showCarModelPop = true;
      this.brand = brand;
      //获取车型
      this.getCarInfoList(param).then((data) => {
        this.modelList = data;
      });
    },
    onModelChange(model) {
      this.model = model;
      if (this.model == "不限") {
        this.onConfirm();
        return;
      } else {
        let param = {
          optionType: CAR_OPTION_TYPE.YEAR,
          brand: this.brand,
          model,
        };
        this.showCarYearPop = true;
        //获取年款
        this.getCarInfoList(param).then((data) => {
          this.yearList = data;
        });
      }
    },
    onYearChange(year) {
      this.year = year;
      if (this.year == "不限") {
        this.onConfirm();
        return;
      } else {
        let param = {
          optionType: CAR_OPTION_TYPE.DISPLACEMENT,
          brand: this.brand,
          model: this.model,
          year,
        };
        this.showCarDisplacementPop = true;
        //获取排量
        this.getCarInfoList(param).then((data) => {
          this.displacementList = data;
        });
      }
    },
    onDisplacementChange(displacement) {
      this.displacement = displacement;
      this.onConfirm();
    },
    onConfirm() {
      let arr = [this.brand, this.model, this.year, this.displacement];
      let newArr = arr.filter((item) => item && item !== "不限");
      this.init();
      this.$emit("confirm", newArr.join("、"));
      this.closePopup();
    },
    transformBrandList(list) {
      //重新组装车辆品牌列表数据
      let newList = {};
      list.forEach((item) => {
        let _index = item.index.toUpperCase();
        if (!newList[_index]) {
          newList[_index] = [];
        }
        newList[_index].push(item.brand);
      });
      this.brandList = newList;
    },
    jump(name) {
      const $title = document.getElementById("title");
      let $letter = document.getElementById(name);
      if ($letter) {
        $letter.scrollIntoView(true);
      } else {
        $title.scrollIntoView(true);
      }
    },
  },
  watch: {
    /*list:function(newVal, oldVal){
      this.transformBrandList(newVal)
    },*/
    show: function(newVal) {
      this.showCarBrandPop = newVal;
      if (this.showCarBrandPop && this.brandList.length == 0) {
        this.getBrandList();
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
} /** 32px **/
.title {
  height: 54px;
  line-height: 54px;
  text-align: center;
  box-sizing: border-box;
  color: @color-primary;
  border-bottom: 1px solid #dbdbdb;
  font-size: 18px;
}
.popup-wrap {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  .list-wrap {
    flex: 1;
    overflow: auto;
    .item {
      font-size: 18px;
      &:active {
        color: #fff;
        background-color: @color-primary;
      }
    }
  }
}
.icon {
  color: @color-primary;
}
.letter-wrap {
  position: fixed;
  top: 50%;
  right: 30px;
  text-align: center;
  z-index: inherit;
  font-size: 18px;
  transform: translateY(-50%);
  line-height: 1.8;
  .letter {
    &:active {
      color: @color-primary;
    }
  }
}
</style>
