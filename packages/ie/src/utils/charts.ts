import type { LegendComponentOption } from 'echarts'
import type { GridOption, XAXisOption, YAXisOption } from 'echarts/types/dist/shared.js'
import { company } from '@/common/js/config'

interface BoxLayoutOptionMixin {
  width?: number | string
  height?: number | string
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  containLabel?: boolean
}

export function getGridConfig(gridConfig?: BoxLayoutOptionMixin): GridOption {
  return {
    top: '15%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true,
    ...gridConfig,
  }
}
export function getYAxisConfig(isShow = true): YAXisOption {
  return {
    nameTextStyle: {
      color: '#666666 ',
      fontSize: 12,
      align: 'left',
    },
    splitNumber: 4,
    splitLine: {
      show: isShow,
      lineStyle: {
        color: '#C9C9C9 ',
        width: 1,
        type: 'dashed', // 'dashed' | 'dotted' | 'solid'
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#C9C9C9',
        width: 1,
        type: 'solid', // 'dashed' | 'dotted' | 'solid'
      },
    },
    axisLabel: {
      show: true,
      color: '#666666 ',
      fontSize: 12,
      padding: [0, 8, 0, 0],
    },
  }
}

export function getXAxisConfig(rotate?: boolean): XAXisOption {
  return {
    axisLine: {
      // 坐标轴轴线相关设置。数学上的x轴
      show: true,
      lineStyle: {
        color: '#C9C9C9',
        width: 1,
        type: 'solid', // 'dashed' | 'dotted' | 'solid'
      },
    },

    axisLabel: {
      color: '#666666 ',
      fontSize: 12,
      padding: [9, 0, 0, 0],
      rotate: rotate ? '60' : '0',
    },
  }
}

type typeIcon = 'rect' | 'roundRect' | 'circle' | 'square' | 'dashed'

export function chartsLegend(iconType: typeIcon) {
  const legendStyle: LegendComponentOption = {
    icon: iconType,
    textStyle: {
      color: '#333333',
      fontSize: 12,
      padding: [0, 0, 0, 4],
    },
  }

  switch (iconType) {
    case 'square':
      legendStyle.itemWidth = 10
      legendStyle.itemHeight = 10
      break

    case 'rect':
      legendStyle.icon
                = 'path://M7.42909,0.00262226C7.73887,0.0281772,8.00769,0.230271,8.12291,0.524231L10.7836,7.29681L12.3889,4.57128C12.5367,4.32002,12.8033,4.16626,13.0909,4.16633L17.1818,4.16633C17.6337,4.16633,18,4.53938,18,4.99957C18,5.45975,17.6337,5.83281,17.1818,5.83281L13.554,5.83281L11.3384,9.59489C11.1785,9.86679,10.8809,10.0228,10.5707,9.9973C10.2605,9.97184,9.99136,9.76937,9.87627,9.4749L7.21718,2.70232L5.61027,5.42785C5.46258,5.67886,5.19643,5.83257,4.90909,5.83281L0.818182,5.83281C0.366312,5.83281,1.36255e-16,5.45975,0,4.99957C0,4.53938,0.366312,4.16633,0.818182,4.16633L4.446,4.16633L6.66245,0.405077C6.82218,0.133508,7.11923,-0.0224268,7.42909,0.00262226Z'
      legendStyle.itemWidth = 18
      legendStyle.itemHeight = 10
      break
    case 'dashed':
      legendStyle.icon
                = 'path://M0 384h512v256H0zM682.666667 384h512v256H682.666667zM1365.333333 384h512v256h-512zM2048 384h512v256h-512z'
      legendStyle.itemWidth = 32
      legendStyle.itemHeight = 6
      break
  }

  return legendStyle
}

export function sliderDataZoomOption(params = {}) {
  return {
    type: 'slider',
    show: params?.show ?? false,
    xAxisIndex: 0,
    startValue: 0,
    endValue: params?.endValue ?? 0, // 一次性展示的数据条数
    zoomLock: true, // 为true时禁止缩放
    brushSelect: false,
  }
}

export const legendConfig = {
  itemGap: 20,
  top: '3%',
}

interface ColorXY {
  x: number
  y: number
  x2: number
  y2: number
}

export function genLinearGradient(
  colors: string[],
  colorXY: ColorXY = { x: 0, y: 0, x2: 0, y2: 1 },
) {
  const color = {
    type: 'linear',
    ...colorXY,
    colorStops: [
      {
        offset: 0,
        color: colors[0], // 0%处的颜色
      },
      {
        offset: 1,
        color: colors[1], // 100%处的颜色
      },
    ],
    global: false,
  }
  return color
}

export function getMarkLine(yAxisData: number, distance? = [-30, -6]) {
  return {
    symbol: 'none',
    data: [
      {
        silent: false,
        yAxis: yAxisData,
        lineStyle: {
          color: '#ff6c36',
          width: 3,
          type: 'dashed',
        },
        label: {
          // 文字标签
          formatter: `${yAxisData}`,
          fontSize: 12,
          fontWeight: 400,
          color: '#ff6c36',
          position: 'insideStartTop',
          distance, // 设置标签文字的样式
          width: 70,
          height: 22,
        },
      },
    ],
    label: {
      fontSize: 24,
      position: 'center',
      fontWeight: 900,
    },
  }
}

type TooltipFormatter = string | ((params: any) => string)
export const tooltipFormatter: TooltipFormatter = (params, index: number = 0) => {
  let tooltipHtml = `<div>${company.find(item => item.companyAlias === params[0].name)?.companyShortName || params[0].name}</div>`
  for (let i = 0; i < params.length; i++) {
    const dataItem = params[i]
    tooltipHtml += `<div style="display: flex;align-items: center;">
      <div style=" width:12px; height:12px; border-radius: 50%;background-color: ${typeof dataItem.color === 'object' ? dataItem.color.colorStops[index].color : dataItem.color}; margin-right:4px;"></div>`
    tooltipHtml += `<div>${dataItem.seriesName}:${dataItem.value ?? '/'}</div></div>`
  }
  return tooltipHtml
}
export const generalTooltip: any = {
  axis: {
    trigger: 'axis',
    formatter: tooltipFormatter,
  },
}
