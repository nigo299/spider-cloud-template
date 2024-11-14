<script setup>
import { Checkbox, Pagination, Select } from 'ant-design-vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// 定义props
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Boolean, Object],
  },
  // 多选 'multiple'
  mode: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  // 选择框宽度
  width: {
    type: String,
  },
  // 是否自定义设置下拉label
  customLabel: {
    type: String,
  },
  // 传入的option数组中，要作为最终选择项的键值key
  valueKey: {
    type: String,
    default: 'key',
  },
  // 传入的option数组中，要作为显示项的键值名称
  labelKey: {
    type: String,
    default: 'label',
  },
  // 下拉框组件数据源
  optionSource: {
    type: Array,
  },
  // 是否显示分页
  isShowPagination: {
    type: Boolean,
    default: false,
  },
  // 分页配置项
  paginationOption: {
    type: Object,
    default: () => ({
      pageSize: 6, // 每页显示条数
      current: 1, // 当前页
      total: 0, // 总条数
    }),
  },
})

const emit = defineEmits(['update:modelValue', 'select', 'change', 'current-change'])

const selectOpen = ref(false)
const main = ref(null)

const childSelectedValue = computed({
  get() {
    return props.modelValue || undefined
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const attrs = computed(() => ({
  allowClear: true,
  showSearch: true,
  ...props.$attrs,
}))

const selectChecked = computed(() =>
  childSelectedValue.value?.length === props.optionSource?.length,
)

// 点击空白区域
const bodyCloseMenus = (e) => {
  if (main.value && !main.value.contains(e.target)) {
    if (selectOpen.value === true) {
      selectOpen.value = false
    }
  }
}

// 点击全选
const selectAll = (val) => {
  const options = JSON.parse(JSON.stringify(props.optionSource))

  if (val.target.checked) {
    childSelectedValue.value = options?.map((item) => {
      return item[props.valueKey]
    })
    setTimeout(() => {
      emit('change', childSelectedValue.value)
    }, 0)
  }
  else {
    childSelectedValue.value = null
  }
  selectOpen.value = false
}

const handleSelect = (value, option) => {
  if (value) {
    selectOpen.value = false
  }
  emit('select', value, option)
}

// 切换分页
const currentChange = (val) => {
  // console.log('切换分页', val)
  if (!props.mode) {
    childSelectedValue.value = null
  }
  setTimeout(() => {
    selectOpen.value = true
  }, 0)
  emit('current-change', val)
}

// 自定义label显示
const customLabelHandler = (item) => {
  // eslint-disable-next-line no-eval
  return eval(props.customLabel)
}

onMounted(() => {
  document.addEventListener('click', bodyCloseMenus)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', bodyCloseMenus)
})
</script>

<template>
  <div
    ref="main"
    @mousedown="e => {
      e.preventDefault()
      selectOpen = true
    }"
  >
    <Select
      v-model:value="childSelectedValue"
      class="t_select"
      :style="{ width: width || '100%' }"
      :placeholder="placeholder"
      :open="selectOpen"
      v-bind="attrs"
      :mode="mode"
      @select="handleSelect"
    >
      <template v-for="(_, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
      <template v-for="(_, name) in $slots" #[name]="data">
        <slot :name="name" v-bind="data" />
      </template>

      <template #dropdownRender="menu">
        <div>
          <Checkbox
            v-if="mode && !isShowPagination"
            :checked="selectChecked"
            class="all_checkbox"
            @change="selectAll"
          >
            全选
          </Checkbox>
          <component :is="menu" />
          <div v-if="isShowPagination" class="t_select__pagination">
            <Pagination
              v-model:page-size="paginationOption.pageSize"
              v-model:current="paginationOption.current"
              :total="paginationOption.total"
              v-bind="{
                'size': 'small',
                'hide-on-single-page': true,
                'showQuickJumper': true,
                ...paginationOption.bind,
              }"
              @change="currentChange"
            />
          </div>
        </div>
      </template>

      <Select.Option
        v-for="(item, index) in optionSource"
        :key="index"
        :value="item[valueKey]"
      >
        {{ customLabel ? customLabelHandler(item) : item[labelKey] }}
      </Select.Option>
    </Select>
  </div>
</template>

<style lang="less">
.all_checkbox {
  margin-left: 12px;
  margin-top: 5px;
}
</style>
