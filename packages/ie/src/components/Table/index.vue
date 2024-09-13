<script lang="ts" setup>
interface PageType {
  pageSize: number // 每页数量
  currentPage: number// 页面
  total: number // 总条数
}
interface PropsType {
  height?: number// 高度
  judgeCheck?: boolean // 是否需要二次处理勾选框 true 是_调用页面二次处理，false 否_默认勾选状态
  indexLabel?: string // 序号
  isShowTableIndex?: boolean // 是否展示序号
  isLoading: boolean
  isShowTableSelection?: boolean // 是否展示全选
  tableData: any[] // 展示数据
  tableList: any[] // 表格列配置
  pageInfo?: PageType // 分页信息
  isShowPage?: boolean // 是否展示分页
  childrenProps?: any // 子组件属性
}
const props = withDefaults(defineProps<PropsType>(), {
  height: 400,
  judgeCheck: false,
  indexLabel: '序号',
  isShowTableIndex: false,
  isLoading: false,
  isShowTableSelection: false,
  tableData: () => {
    return []
  },
  tableList: () => {
    return []
  },
  pageInfo: () => {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
    }
  },
  isShowPage: false,
  childrenProps: () => {
    return {}
  },
})
const emits = defineEmits(['selectAllFn', 'selectFn', 'sizeChange', 'currentChange'])
function defaultFn() {
  return true
}
function checkSelectable(row: any) {
// judgeCheck 这个函数是每条数据自带的，实现调用页面控制勾选状态
  let isContain = true
  isContain = row.judgeCheck(row)
  return isContain
}
// 数据为空默认展示
function defaultPresentation(data: any) {
  return data ?? '/' // 如果为null 或者 undefined 就展示 /
}
// 全选
function selectAllFn(selection: any) {
  emits('selectAllFn', selection)
}
// 单选
function selectFn(selection: any) {
  emits('selectFn', selection)
}
function handleSizeChange(dataIndex: number) {
  emits('sizeChange', dataIndex)
}
// 第几页
function handleCurrentChange(dataPage: number) {
  emits('currentChange', dataPage)
}
</script>

<!-- table公共组件 -->
<template>
  <div class="tableBox">
    <div class="header">
      <slot name="headerHander" />
    </div>
    <!--       style="width: 100%" -->
    <el-table
      ref="TableRef"
      v-loading="isLoading"
      :border="true"
      size="small"
      :height="height"
      :data="tableData"
      v-bind="childrenProps"
      @select="selectFn"
      @select-all="selectAllFn"
    >
      <el-table-column v-if="isShowTableSelection" type="selection" :selectable="judgeCheck ? checkSelectable : defaultFn" width="55" />
      <el-table-column v-if="isShowTableIndex" type="index" align="center" :label="indexLabel" width="80" />
      <el-table-column
        v-for="item in tableList"
        :key="item.prop"
        :align="item.align ? item.align : 'center'"
        v-bind="item"
      >
        <template #default="scope">
          <!-- 作用域插槽 -->
          <slot :name="item.slotName" :row="scope.row" :index="scope.$index">
            <el-popover v-if="item.showTooltip && defaultPresentation(scope.row[item.prop]) !== '--'" trigger="hover" placement="top" popper-class="popoverClassBox">
              <div>{{ scope.row[item.prop] }}</div>
              <div slot="reference" class="name-wrapper">
                {{ defaultPresentation(scope.row[item.prop]) }}
              </div>
            </el-popover>
            <span v-else>{{ defaultPresentation(scope.row[item.prop]) }}</span>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="isShowPage">
      <slot name="footer">
        <el-pagination
          class="pager"
          :page-sizes="[10, 15, 20, 30, 50, 100, 300, 500]"
          layout="prev, pager, next, total, sizes, jumper"
          :total="pageInfo.total"
          :current-page="pageInfo.currentPage"
          :page-size="pageInfo.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep {
  .el-loading-spinner {
    display: flex;
    justify-content: center;
  }
}
</style>
