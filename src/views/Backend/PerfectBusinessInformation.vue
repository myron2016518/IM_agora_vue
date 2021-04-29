<template>
  <div>
    <div class="card">
      <div class="card-item">
        <div class="card-item__title">完善商家信息</div>
        <div class="card-item__content">
          <!-- 商家信息表单 -->
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
                  v-model="form.address"
                  size="small"
                  placeholder="请填写商家详细地址"
                  @click.native="showLocation = true"
                ></el-input>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item__label">商家介绍：</div>
              <div class="form-item__content">
                <el-input
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
                  v-model="form.openingHours"
                  placeholder="请填写营业时间"
                  size="small"
                ></el-input>
              </div>
            </div>
            <div class="pl-24 mt-4">
              <el-button
                class="w-full"
                type="primary"
                round
                size="small"
                @click="handleSave"
                >保存</el-button
              >
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
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { EnumBusinessType } from "@/utils/enum";
import { editBusinessInfo, uploadPhoto } from "@/api/api";
import { EnumRole, IUpdateUserRoleInfoPayload } from "@/store/global";

export default Vue.extend({
  name: "perfect-business-information",
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
      headPerson: string;
      openingHours: string;
      lon: null | number;
      lat: null | number;
    }
    return {
      form: {
        logoUrl: "",
        name: "",
        businessType: null,
        address: "",
        desc: "",
        contactPhone: "",
        headPerson: "",
        openingHours: "",
        lon: null,
        lat: null
      } as TForm,
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
      ],
      showLocation: false
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"])
  },
  methods: {
    ...mapActions("GlobalModule", ["updateUserRoleInfo"]),
    handleClickAvatar() {
      (this.$refs.upload as HTMLInputElement).click();
    },
    handleSave() {
      if (this.checkForm()) {
        this.requestEditBusinessInfo();
      }
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
        golo_user_id: this.user.golo_user_id,
        b_id: this.user.b_id,
        name: this.form.name,
        logo_url: this.form.logoUrl,
        shop_type: this.form.businessType as number,
        lon: this.form.lon as number,
        lat: this.form.lat as number,
        address: this.form.address,
        desc: this.form.desc,
        head_person: this.form.headPerson,
        contact_phone: this.form.contactPhone,
        opening_hours: this.form.openingHours
      }).then(rsp => {
        this.$message.success("商家信息完善成功！");
        this.updateUserRoleInfo({
          roleId: EnumRole.商家管理员,
          bId: rsp.data
        } as IUpdateUserRoleInfoPayload);
        this.$router.back();
      });
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
    locationChanged(loc: any) {
      this.form.lat = loc.latlng.lat;
      this.form.lon = loc.latlng.lng;
      this.form.address = loc.poiaddress;
    }
  }
});
</script>

<style lang="less" scoped>
.card {
  @apply p-8 mt-8;
}

.form {
  @apply ml-4;
  width: 512px;
}
</style>
