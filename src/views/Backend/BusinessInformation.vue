<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>商家信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 详情 -->
    <div class="mt-4 px-8">
      <div class="card">
        <!-- 固定右上方按钮 -->
        <div class="absolute right-8 top-8">
          <template v-if="disabled">
            <!-- // todo: 修改绑定手机 -->
            <!-- <el-button size="small" round>修改绑定手机</el-button> -->
            <el-button
              size="small"
              round
              @click="handleEditInfo"
              v-if="isBusiness"
              >编辑商家信息</el-button
            >
          </template>
          <template v-else>
            <el-button
              size="small"
              round
              type="primary"
              @click="handleSubmitEdit"
              key="3"
              >提交</el-button
            >
            <el-button size="small" round @click="handleCancelEdit" key="4"
              >取消</el-button
            >
          </template>
        </div>
        <!-- 基本信息 -->
        <div class="card-item">
          <div class="card-item__title">基本信息</div>
          <div class="card-item__content">
            <div class="flex mr-8">商家账号：{{ user.golo_user_id }}</div>
            <div class="flex mr-8">绑定微信：{{ user.nickname }}</div>
            <div class="flex">绑定手机：{{ user.phone }}</div>
          </div>
        </div>
        <!-- 商家信息 -->
        <div class="card-item">
          <div class="card-item__title">
            商家信息
          </div>
          <div class="card-item__content">
            <div class="form">
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>商家标志：
                </div>
                <div class="form-item__content">
                  <div class="relative">
                    <el-avatar
                      :src="form.logoUrl"
                      fit="contain"
                      icon="el-icon-user-solid"
                      class="cursor-pointer z-10"
                      @click.native="handleClickAvatar"
                    ></el-avatar>
                    <input
                      type="file"
                      class="opacity-0 absolute left-0 top-0 w-0"
                      style="z-index:-10"
                      accept="image/*"
                      ref="upload"
                      @change="fileChanged"
                    />
                  </div>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>商家名称：
                </div>
                <div class="form-item__content">
                  <el-input
                    size="small"
                    :disabled="disabled"
                    v-model="form.name"
                    placeholder="请填写商家名称"
                  ></el-input>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>商家类型：
                </div>
                <div class="form-item__content">
                  <el-select
                    :disabled="disabled"
                    class="w-full"
                    v-model="form.businessType"
                    size="small"
                  >
                    <el-option
                      v-for="option in businessTypeOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>商家地址：
                </div>
                <div class="form-item__content">
                  <el-input
                    :disabled="disabled"
                    v-model="form.address"
                    size="small"
                    placeholder="请填写商家详细地址"
                    @click.native="handleClickAddress"
                  ></el-input>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">商家介绍：</div>
                <div class="form-item__content">
                  <el-input
                    :disabled="disabled"
                    type="textarea"
                    v-model="form.desc"
                    placeholder="商家介绍：如技术资质、专业背景等...."
                    maxlength="100"
                    size="small"
                    show-word-limit
                  ></el-input>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>联系人姓名：
                </div>
                <div class="form-item__content">
                  <el-input
                    :disabled="disabled"
                    v-model="form.headPerson"
                    placeholder="请填写联系人姓名"
                    size="small"
                  ></el-input>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">
                  <span class="form-item__required">*</span>联系人电话：
                </div>
                <div class="form-item__content">
                  <el-input
                    :disabled="disabled"
                    v-model="form.contactPhone"
                    placeholder="请填写联系人电话，如未填写客户将无法联系你"
                    size="small"
                  ></el-input>
                </div>
              </div>
              <div class="form-item">
                <div class="form-item__label">营业时间：</div>
                <div class="form-item__content">
                  <el-input
                    :disabled="disabled"
                    v-model="form.openingHours"
                    placeholder="请填写营业时间"
                    size="small"
                  ></el-input>
                </div>
              </div>
            </div>
            <!-- 地图选择器 -->
            <Location
              class="ml-8"
              style="height: 400px"
              v-if="showLocation"
              @locationChanged="locationChanged"
            ></Location>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { EnumBusinessType } from "@/utils/enum";
import { editBusinessInfo, getShopDetail, uploadPhoto } from "@/api/api";

export default Vue.extend({
  name: "business-information",
  components: {
    Location: () => import("@/components/Location.vue")
  },
  data() {
    interface TForm {
      logoUrl: string;
      name: string;
      businessType: null | number;
      address: string;
      desc: string;
      contactPhone: string;
      openingHours: string;
      headPerson: string;
      lon: null | number;
      lat: null | number;
    }

    return {
      disabled: true,
      showLocation: false,
      form: {
        logoUrl: "",
        name: "",
        businessType: null,
        address: "",
        desc: "",
        contactPhone: "",
        openingHours: "",
        headPerson: "",
        lon: null,
        lat: null
      } as TForm,
      memForm: {} as TForm,
      businessTypeOptions: [
        {
          label: "普通维修厂",
          value: EnumBusinessType.普通维修厂
        },
        {
          label: "快修连锁店",
          value: EnumBusinessType.快修连锁店
        },
        {
          label: "品牌专修店",
          value: EnumBusinessType.品牌专修店
        },
        {
          label: "汽车改装店",
          value: EnumBusinessType.汽车改装店
        },
        {
          label: "汽车电子专修",
          value: EnumBusinessType.汽车电子专修
        },
        {
          label: "其他",
          value: EnumBusinessType.其他
        }
      ]
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    ...mapGetters("GlobalModule", ["isBusiness"])
  },
  beforeMount() {
    this.requestGetBusinessInfo();
  },
  methods: {
    handleEditInfo() {
      this.disabled = false;
      this.memForm = { ...this.form };
    },
    handleCancelEdit() {
      this.disabled = true;
      this.showLocation = false;
      this.form = { ...this.memForm };
    },
    handleSubmitEdit() {
      this.disabled = true;
      this.showLocation = false;
      this.requestEditBusinessInfo();
    },
    handleClickAvatar() {
      if (this.disabled) return;
      (this.$refs.upload as HTMLInputElement).click();
    },
    handleClickAddress() {
      if (this.disabled) return;
      this.showLocation = true;
    },
    checkForm() {
      if (!this.form.logoUrl) {
        this.$message.error("请选择商家logo");
        return false;
      }
      if (!this.form.name) {
        this.$message.error("请输入商家名称");
        return false;
      }
      if (!this.form.businessType) {
        this.$message.error("请选择商家类型");
        return false;
      }
      if (!this.form.address) {
        this.$message.error("请选择商家所在地址");
        return false;
      }
      if (!this.form.contactPhone) {
        this.$message.error("请输入联系人电话");
        return false;
      }
      if (!this.form.headPerson) {
        this.$message.error("请输入联系人姓名");
        return false;
      }
      return true;
    },
    requestEditBusinessInfo() {
      return editBusinessInfo({
        user_id: this.user.user_id,
        b_id: this.user.b_id,
        name: this.form.name,
        logo_url: this.form.logoUrl,
        shop_type: this.form.businessType as number,
        lon: this.form.lon as number,
        lat: this.form.lat as number,
        address: this.form.address,
        desc: this.form.desc,
        contact_phone: this.form.contactPhone,
        head_person: this.form.headPerson,
        opening_hours: this.form.openingHours
      }).then(() => {
        this.$message.success({
          message: "修改成功！"
        });

        this.requestGetBusinessInfo();
      });
    },
    locationChanged(loc: any) {
      this.form.lat = loc.latlng.lat;
      this.form.lon = loc.latlng.lng;
      this.form.address = loc.poiaddress;
    },
    fileChanged(event: InputEvent) {
      console.group("fileChanged");
      console.log(event);
      this.requestUploadFile(
        ((event.target as HTMLInputElement).files as FileList)[0]
      );
      console.groupEnd();
    },
    requestUploadFile(file: File) {
      return uploadPhoto({
        file
      }).then(rsp => {
        this.form.logoUrl = rsp.data.url;
      });
    },
    requestGetBusinessInfo() {
      return getShopDetail({
        b_id: this.user.b_id
      }).then(rsp => {
        // !填补后端接口的坑
        this.form.logoUrl = rsp.data.logo_url ?? "";
        this.form.name = rsp.data.name ?? "";
        this.form.desc = rsp.data.desc ?? "";
        this.form.businessType =
          rsp.data.shop_type > 0 ? +rsp.data.shop_type : null;
        this.form.address = rsp.data.address ?? "";
        this.form.lon = rsp.data.lon ?? "";
        this.form.lat = rsp.data.lat ?? "";
        this.form.contactPhone = rsp.data.contact_phone ?? "";
        this.form.openingHours = rsp.data.opening_hours ?? "";
        this.form.headPerson = rsp.data.head_person ?? "";
      });
    }
  }
});
</script>

<style lang="less" scoped>
.card {
  @apply w-full min-h-96 p-8;
}
</style>
