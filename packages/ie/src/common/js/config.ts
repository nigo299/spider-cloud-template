/*
* 数字证件通用配置项
*/

import { throttle } from 'lodash-es'

/*
* 加载loading延迟时间--300ms
*/
export const loginOutUrl = import.meta.env.MODE === 'build' ? 'http://cas.cq.sgcc.com.cn/isc_sso/logout?service=http://25.64.126.175/board/index' : 'http://cas.cq.sgcc.com.cn/isc_sso/logout?service=http://25.64.126.175/board-debug/index'

export const customDelay = 500

/*
* 表格序号样式
*/
export const customTableIndexStyle = {
  width: 50,
  align: 'center',
}

/*
* 表格分页样式
*/
export const customPaginationOptions = {
  showTotal: (total: number) => `共 ${total} 条`,
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
}

/*
* 表格除去title和分页以及padding的高度
*/
export const titleAndPaginationHeight = {
  common: 96,
  meetingAndTrain: 126,
  logsAndRole: 106,
}

/*
* 节流通用配置
*/
export const commonThrottleConfig = {
  time: 500,
  config: { leading: true, trailing: true },
}

export const TOKEN_KEY = 'indicator-token'

export const WEB_PERMISSION_KEY = 'indicator-permission-list'


/**
 * 通用节流函数
 * @param fn 需要节流函数，类型为any
 * @param time 节流时间
 */
export function commonThrottle(fn: any, time?: number, leading: boolean = true, trailing: boolean = true) {
  return throttle(
    fn,
    time ?? commonThrottleConfig.time,
    { ...commonThrottleConfig.config, leading, trailing },
  )
}

export const company = [
  {
    companyName: '国网重庆市电力公司大足供电分公司',
    companyShortName: '国网大足供电公司',
    companyAlias: '大足',
  },
  {
    companyName: '国网重庆市电力公司开州供电分公司',
    companyShortName: '国网开州供电公司',
    companyAlias: '开州',
  },
  {
    companyName: '国网重庆市电力公司建设分公司',
    companyShortName: '国网重庆建设公司',
    companyAlias: '建设',
  },
  {
    companyName: '国网重庆市电力公司黔江供电分公司',
    companyShortName: '国网黔江供电公司',
    companyAlias: '黔江',
  },
  {
    companyName: '国网重庆市电力公司秀山供电分公司',
    companyShortName: '国网秀山供电公司',
    companyAlias: '秀山',
  },
  {
    companyName: '国网重庆市电力公司潼南供电分公司',
    companyShortName: '国网潼南供电公司',
    companyAlias: '潼南',
  },
  {
    companyName: '国网重庆市电力公司璧山供电分公司',
    companyShortName: '国网璧山供电公司',
    companyAlias: '璧山',
  },
  {
    companyName: '国网重庆市电力公司奉节供电分公司',
    companyShortName: '国网奉节供电公司',
    companyAlias: '奉节',
  },
  {
    companyName: '国网重庆市电力公司黔江供电分公司',
    companyShortName: '国网黔江供电公司',
    companyAlias: '黔江',
  },
  {
    companyName: '国网重庆市电力公司永川供电分公司',
    companyShortName: '国网永川供电公司',
    companyAlias: '永川',
  },
  {
    companyName: '国网重庆市电力公司超高压分公司',
    companyShortName: '国网重庆超高压公司',
    companyAlias: '超高压',
  },
  {
    companyName: '国网重庆市电力公司超高压供电分公司',
    companyShortName: '国网重庆超高压公司',
    companyAlias: '超高压',
  },
  {
    companyName: '国网重庆市电力公司云阳供电分公司',
    companyShortName: '国网云阳供电公司',
    companyAlias: '云阳',
  },
  {
    companyName: '国网重庆市电力公司巫山供电分公司',
    companyShortName: '国网巫山供电公司',
    companyAlias: '巫山',
  },
  {
    companyName: '重庆市送变电工程有限公司',
    companyShortName: '重庆送变电公司',
    companyAlias: '送变电',
  },
  {
    companyName: '国网重庆市电力公司忠县供电分公司',
    companyShortName: '国网忠县供电公司',
    companyAlias: '忠县',
  },
  {
    companyName: '国网重庆市电力公司信通分公司',
    companyShortName: '国网信通公司',
    companyAlias: '信通',
  },
  {
    companyName: '国网重庆市电力公司丰都供电分公司',
    companyShortName: '国网丰都供电公司',
    companyAlias: '丰都',
  },
  {
    companyName: '国网重庆市电力公司酉阳供电分公司',
    companyShortName: '国网酉阳供电公司',
    companyAlias: '酉阳',
  },
  {
    companyName: '国网重庆市电力公司石柱供电分公司',
    companyShortName: '国网石柱供电公司',
    companyAlias: '石柱',
  },
  {
    companyName: '国网重庆市电力公司南川供电分公司',
    companyShortName: '国网南川供电公司',
    companyAlias: '南川',
  },
  {
    companyName: '国网重庆市电力公司彭水供电分公司',
    companyShortName: '国网彭水供电公司',
    companyAlias: '彭水',
  },
  {
    companyName: '国网重庆市电力公司垫江供电分公司',
    companyShortName: '国网垫江供电公司',
    companyAlias: '垫江',
  },
  {
    companyName: '国网重庆市电力公司铜梁供电分公司',
    companyShortName: '国网铜梁供电公司',
    companyAlias: '铜梁',
  },
  {
    companyName: '国网重庆市电力公司北碚供电分公司',
    companyShortName: '国网北碚供电公司',
    companyAlias: '北碚',
  },
  {
    companyName: '国网重庆市电力公司市北供电分公司',
    companyShortName: '国网重庆市北供电公司',
    companyAlias: '市北',
  },
  {
    companyName: '国网重庆市电力公司万州供电分公司',
    companyShortName: '国网万州供电公司',
    companyAlias: '万州',
  },
  {
    companyName: '重庆展帆电力工程勘察设计咨询有限公司',
    companyShortName: '国网展帆公司',
    companyAlias: '展帆',
  },
  {
    companyName: '国网重庆市电力公司江津供电分公司',
    companyShortName: '国网江津供电公司',
    companyAlias: '江津',
  },
  {
    companyName: '国网重庆市电力公司城口供电分公司',
    companyShortName: '国网城口供电公司',
    companyAlias: '城口',
  },
  {
    companyName: '国网重庆市电力公司市区供电分公司',
    companyShortName: '国网重庆市区供电公司',
    companyAlias: '市区',
  },
  {
    companyName: '国网重庆市电力公司市南供电分公司',
    companyShortName: '国网重庆市南供电公司',
    companyAlias: '市南',
  },
  {
    companyName: '国网重庆市电力公司巫溪供电分公司',
    companyShortName: '国网巫溪供电公司',
    companyAlias: '巫溪',
  },
  {
    companyName: '国网重庆市电力公司武隆供电分公司',
    companyShortName: '国网武隆供电公司',
    companyAlias: '武隆',
  },
  {
    companyName: '国网重庆市电力公司合川供电分公司',
    companyShortName: '国网合川供电公司',
    companyAlias: '合川',
  },
  {
    companyName: '国网重庆市电力公司长寿供电分公司',
    companyShortName: '国网长寿供电公司',
    companyAlias: '长寿',
  },
  {
    companyName: '重庆川东电力集团有限责任公司',
    companyShortName: '川东电力公司',
    companyAlias: '川东',
  },
  {
    companyName: '国网重庆市电力公司綦江供电分公司',
    companyShortName: '国网綦江供电公司',
    companyAlias: '綦江',
  },
  {
    companyName: '重庆涪陵电力实业股份有限公司',
    companyShortName: '重庆涪陵电力实业',
    companyAlias: '涪陵',
  },
  {
    companyName: '重庆两江供电有限公司',
    companyShortName: '两江供电有限公司',
    companyAlias: '两江',
  },
  {
    companyName: '国网重庆市电力公司',
    companyShortName: '国网重庆市电力公司',
    companyAlias: '市公司',
  },
  {
    companyName: '国网重庆电力公司市营销服务中心',
    companyShortName: '国网重庆营服中心',
    companyAlias: '营服',
  },
  {
    companyName: '重庆长耀售电有限责任公司',
    companyShortName: '重庆长耀售电有限公司',
    companyAlias: '长耀',
  },
  {
    companyName: '国网重庆电动汽车服务有限公司',
    companyShortName: '国网重庆电动汽车公司',
    companyAlias: '电动汽车',
  },
  {
    companyName: '国网重庆市电力公司信息通信分公司',
    companyShortName: '国网重庆信通公司',
    companyAlias: '信通',
  },
  {
    companyName: '国网重庆市电力公司电力科学研究院',
    companyShortName: '国网重庆电科院',
    companyAlias: '电科院',
  },
  {
    companyName: '国网重庆市电力公司经济技术研究院',
    companyShortName: '国网重庆经研院',
    companyAlias: '经研院',
  },
  {
    companyName: '国网重庆综合能源服务有限公司',
    companyShortName: '国网重庆综能公司',
    companyAlias: '综合能源',
  },
  {
    companyName: '重庆电力交易中心有限公司',
    companyShortName: '交易中心',
    companyAlias: '交易中心',
  },
]
/*
* table表 单位转换成8字展示
*/
export function conversionNameFn(nameData: string) {
  const name = company.find(item => item.companyName === nameData)
  return name ? name.companyShortName ?? '/' : nameData ?? '/'
}

export function threeDigitSegmentation(
  num: number | undefined,
  minimum: number = 0,
  maximum: number = 2,
) {
  let formattedNumber: string = ''
  if (!num) {
    formattedNumber = '/'
  }
  else {
    formattedNumber = num.toLocaleString(undefined, {
      minimumFractionDigits: minimum,
      maximumFractionDigits: maximum,
    })
  }

  return formattedNumber
}
