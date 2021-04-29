<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb class="mt-8">
      <el-breadcrumb-item>商家管理</el-breadcrumb-item>
      <el-breadcrumb-item>技师管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表 -->
    <div class="mt-4 px-8">
      <el-table
        v-loading="listLoading"
        :data="list"
        size="small"
        header-row-class-name="table-header-row"
        header-cell-class-name="table-header-cell"
      >
        <!-- <el-table-column
          prop="user_name"
          label="姓名"
          align="center"
        ></el-table-column> -->
        <el-table-column
          prop="nickname"
          label="微信昵称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="绑定手机"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="city"
          label="所在地"
          align="center"
        ></el-table-column>
        <el-table-column prop="roleType" label="类型" align="center">
          <template slot-scope="scope">
            {{ EnumRole[scope.row.role_id] }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="createdAt"
          label="加入时间"
          align="center"
        ></el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              v-if="isBusiness && scope.row.user_id !== user.user_id"
              title="确定移除该成员吗？"
              @confirm="requestDelTechnician(scope.row.user_id)"
            >
              <a class="table__button mr-4" slot="reference">删除成员</a>
            </el-popconfirm>
            <a
              class="table__button"
              @click="
                $router.push({
                  name: 'technician-detail',
                  params: {
                    user_id: scope.row.user_id,
                    user_name: scope.row.user_name,
                    nickname: scope.row.nickname,
                    phone: scope.row.phone,
                    city: scope.row.city
                  }
                })
              "
              >详情</a
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { delShopTechnician, getMyTechnicianList } from "@/api/api";
import { EnumRole } from "@/store/global";
import { mapGetters, mapState } from "vuex";
import Vue from "vue";
export default Vue.extend({
  name: "technician-management",
  data() {
    return {
      list: [] as any[],
      listLoading: false,
      EnumRole
    };
  },
  computed: {
    ...mapState("GlobalModule", ["user"]),
    ...mapGetters("GlobalModule", ["isBusiness"])
  },
  beforeMount() {
    this.requestList();
  },
  methods: {
    requestList() {
      this.listLoading = true;
      return getMyTechnicianList({
        user_id: this.user.user_id as number
      })
        .then(rsp => {
          this.list = rsp.data;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    requestDelTechnician(del_user_id: number) {
      return delShopTechnician({
        user_id: this.user.user_id,
        del_user_id
      }).then(rsp => {
        this.$message.success("删除成功！");
        this.requestList();
      });
    }
  }
});
</script>

<style lang="less" scoped></style>
