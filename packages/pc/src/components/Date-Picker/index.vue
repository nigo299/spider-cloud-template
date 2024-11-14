<script lang="ts" setup>
import { DatePicker } from 'ant-design-vue'
import type { Dayjs, ManipulateType, OpUnitType } from 'dayjs'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

interface Props {
  modelValue: [Dayjs | null, Dayjs | null]
  format?: string
  showTime?: boolean | Record<string, any>
  allowClear?: boolean
  type?: 'day' | 'month' | 'quarter' | 'year'
  langest?: boolean | number
  disabledRange?: [Dayjs | false, Dayjs | false]
  inputReadOnly?: boolean
  placeholder?: [string, string]
  getCalendarContainer?: () => HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [null, null],
  format: 'YYYY-MM-DD HH:mm:ss',
  showTime: false,
  allowClear: false,
  type: 'day',
  langest: false,
  disabledRange: () => [false, false],
  inputReadOnly: false,
  placeholder: () => ['开始时间', '结束时间'],
  getCalendarContainer: () => document.body,
})

const emit = defineEmits<{
  'update:modelValue': [dates: [Dayjs | null, Dayjs | null]]
  'openChange': []
}>()

const endOpen = ref(false)

// 计算最后可选日期
const getLastOptionalDate = (newVal: [Dayjs | null, Dayjs | null] = [null, null]): Dayjs | false => {
  const { disabledRange, langest, type } = props
  newVal = newVal[0] ? newVal : props.modelValue
  let lastOptionalDate: Dayjs | false = false

  if (!newVal[0])
    return false

  if (langest && disabledRange[1]) {
    lastOptionalDate = disabledRange[1].isBefore(dayjs(newVal[0]).add(Number(langest) - 1, type as ManipulateType).endOf(type as ManipulateType))
      ? disabledRange[1]
      : dayjs(newVal[0]).add(Number(langest) - 1, type as ManipulateType).endOf(type as ManipulateType)
  }
  else if (langest && !disabledRange[1]) {
    lastOptionalDate = dayjs(newVal[0]).add(Number(langest) - 1, type as ManipulateType).endOf(type as ManipulateType)
  }
  else if (!langest && disabledRange[1]) {
    lastOptionalDate = disabledRange[1]
  }

  return lastOptionalDate === false ? false : lastOptionalDate.clone()
}

const lastOptionalDate = computed(() => getLastOptionalDate())

const agentDisabledRange = computed(() => {
  const { disabledRange, type } = props

  if (type === 'day') {
    return disabledRange
  }
  return [
    disabledRange[0] ? disabledRange[0].startOf(type as OpUnitType) : null,
    disabledRange[1] ? disabledRange[1].endOf(type as OpUnitType) : null,
  ]
})

const disabledStartDate = (current: Dayjs): boolean => {
  const { type } = props
  if (!current)
    return false

  return !((!agentDisabledRange.value[0] || current.valueOf() >= dayjs(agentDisabledRange.value[0]).startOf(type as OpUnitType).valueOf())
    && (!agentDisabledRange.value[1] || current.valueOf() <= dayjs(agentDisabledRange.value[1]).endOf(type as OpUnitType).valueOf()))
}

const disabledEndDate = (current: Dayjs): boolean => {
  const { type } = props
  if (!current)
    return false

  return !((props.modelValue[0] && current.valueOf() >= props.modelValue[0].valueOf())
    && (!lastOptionalDate.value || dayjs(current).startOf(type as OpUnitType).valueOf() < lastOptionalDate.value.valueOf()))
}

// 事件处理方法
const handleStartOpenChange = (open: boolean) => {
  emit('openChange')

  if (!open) {
    endOpen.value = true
  }
}

const handleEndOpenChange = (open: boolean) => {
  emit('openChange')
  endOpen.value = open
}

const dateStartChange = (date: Dayjs | null) => {
  if (!date) {
    emit('update:modelValue', [null, null])
    return
  }

  const { type } = props
  const lastOptionalDate = getLastOptionalDate([date, props.modelValue[1]])
  let endDate = props.modelValue[1]

  if (props.modelValue[1] && date.valueOf() > props.modelValue[1].valueOf()) {
    endDate = lastOptionalDate && lastOptionalDate.isBefore(date.clone().endOf(type as OpUnitType))
      ? lastOptionalDate
      : date.clone().endOf(type as OpUnitType)
  }
  else if (lastOptionalDate && endDate && endDate.valueOf() > lastOptionalDate.valueOf()) {
    endDate = lastOptionalDate
  }

  emit('update:modelValue', [date?.clone(), endDate])
}

const dateEndChange = (date: Dayjs | null) => {
  const { type, showTime } = props

  if (!showTime && date) {
    date = date.clone().endOf(type as OpUnitType)
  }

  const lastOptionalDate = getLastOptionalDate([props.modelValue[0], date])
  emit('update:modelValue', [
    props.modelValue[0],
    lastOptionalDate ? (date?.isBefore(lastOptionalDate) ? date : lastOptionalDate) : date,
  ])
}

// 组件配置计算属性
const startCompOpt = computed(() => {
  const opt: {
    is: typeof DatePicker | typeof DatePicker.MonthPicker
    bind: Record<string, any>
    event: Record<string, any>
  } = {
    is: DatePicker,
    bind: {
      format: props.format,
      disabledDate: disabledStartDate,
      allowClear: props.allowClear,
      value: props.modelValue[0],
      inputReadOnly: props.inputReadOnly,
      placeholder: props.placeholder[0],
      getPopupContainer: props.getCalendarContainer,
    },
    event: {
      'update:open': handleStartOpenChange,
      'update:value': dateStartChange,
    },
  }

  if (props.type === 'month') {
    opt.is = DatePicker.MonthPicker
  }
  else {
    opt.bind.showTime = props.showTime
  }

  return opt
})

const endCompOpt = computed(() => {
  const opt: {
    is: typeof DatePicker | typeof DatePicker.MonthPicker
    bind: Record<string, any>
    event: Record<string, any>
  } = {
    is: DatePicker,
    bind: {
      format: props.format,
      disabledDate: disabledEndDate,
      allowClear: props.allowClear,
      value: props.modelValue[1],
      open: endOpen.value,
      disabled: !props.modelValue[0],
      inputReadOnly: props.inputReadOnly,
      placeholder: props.placeholder[1],
      getPopupContainer: props.getCalendarContainer,
    },
    event: {
      'update:open': handleEndOpenChange,
      'update:value': dateEndChange,
    },
  }

  if (props.type === 'month') {
    opt.is = DatePicker.MonthPicker
  }
  else {
    opt.bind.showTime = props.showTime
  }

  return opt
})
</script>

<template>
  <div class="t-antd-range-picker">
    <component :is="startCompOpt.is" v-bind="startCompOpt.bind" v-on="startCompOpt.event" />
    <div class="divider">
      -
    </div>
    <component :is="endCompOpt.is" v-bind="endCompOpt.bind" v-on="endCompOpt.event" />
  </div>
</template>

<style lang="less" scoped>
.t-antd-range-picker {
  display: flex;
  align-items: center;

  .divider {
    margin: 0 10px;
  }
}
</style>
