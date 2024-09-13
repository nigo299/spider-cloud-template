export enum ORGANIZATION_LEVEL_TYPE {
  company = 0,
  unit = 1,
  department = 2,
}

export enum SEGMENT_TIME {
  year = "year",
  month = "month",
  date = "date",
}

export enum SEGMENT_TIME_NUM {
  year = 0,
  month = 1,
  date = 2,
}

export enum COMPLAINTS_TYPE {
  absNumTimes = "absNumTimes",
  complaintVol = "complaintVol",
}

export enum COMPLAINTS_TYPE_NUM {
  absNumTimes = 0,
  complaintVol = 1,
}

export enum SEGMENT_PROVINCE {
  include = 0,
  notInclude = 1,
}

export enum SEGMENT_UNIT {
  POWER_SUPPLY = "gd", // 供电单位
  SUPPORT = "zc", // 支撑单位
  INDUSTRY = "cy", // 产业单位
}

export enum FormColumnTypeEnum {
  INPUT = "input",
  SELECT = "select",
  DATE_RANGE = "dateRange",
  TEXTAREA = "textarea",
  CASCADER = "cascader",
  DATE = "date",
  NUMBER = "number",
  SWITCH = "switch",
  SEARCH_SELECT = "searchSelect",
  TREE_SELECT = "treeSelect",
}

export enum TableColumnTypeEnum {
  TEXT = "text", // 普通文本
  LINK = "link", // 超链接
  TAG = "tag", // 标签
  SELECT = "select", // 选项
  DATE = "date", // 日期
  OPERATION = "operation", // 操作栏
  INDEX = "index", // 序号
  ARRAY = "array", // 数组
  TOOLTIP = "tooltip", // 有提示
  SEX = "sex", // 性别
  NUMBER = "number",
}

export enum PowerOutageSituationTypeEnum {
  plan = "plan",
  fault = "fault",
}

export enum PowerOutageSituationSonTypeEnum {
  new = "new",
  recovery = "recovery",
}

export enum PowerOutageSituationType {
  plan = "停复电情况(计划)",
  fault = "停复电情况(故障)",
}

export enum PowerOutageSituationSonType {
  new = "计划停电",
  recovery = "未复电情况",
}

export enum PowerOutageSituationSonFaultType {
  new = "故障停电",
  recovery = "未复电情况",
}

/*
 *  showDatePicker
 *  showRefreshButton
 *  showRegionalSelection
 *  datePickerModel 'date' | 'range'
 * */
export const SIDEBAR_TO_ROUTE = {
  // 调度实时发受电情况
  "aqsc-ddss": {
    component: "PowerGRSituation",
  },
  // 调度负荷
  "aqsc-ddfh": {
    component: "DispatchLoad",
  },
  // 违章自查自纠
  "aqsc-wzzc": {
    component: "Violation",
  },
  // 在运设备规模
  "aqsc-zysb": {
    component: "RunningEquipmentScale",
  },
  // 配变运行动态
  "aqsc-pbyx": {
    component: "DistributionDynamics",
  },
  // 电力保供 (如果有需要可以加上)
  "aqsc-dlbg": {
    component: "PowerSupplyGuarantee",
  },
  // 停电情况 (同样可以加上)
  "aqsc-tdqk": {
    component: "PowerOutages",
  },
  // 采集成功率
  "aqsc-cjcg": {
    component: "DataCollectionSuccessRate",
  },
  // 分布式光伏
  "aqsc-fbsg": {
    component: "DistributedPV",
  },
  // 售电量
  "jygl-sdl": {
    component: "SalesVolume",
  },
  // 综合线损
  "jygl-zhxs": {
    component: "ComprehensiveLineLoss",
  },
  // 利润
  "jygl-lr": {
    component: "Profit",
  },
  // 带息负债
  "jygl-dxfz": {
    component: "InterestBearingDebt",
  },
  // 营业现金比率
  "jygl-yyxjb": {
    component: "OperatingCashRatio",
  },
  // 电量电费
  "jygl-dldf": {
    component: "ElectricityConsumptionCost",
  },
  // 购售电均价
  "jygl-gsdjj": {
    component: "AveragePurchaseAndSalePrice",
  },
  // 输配电价
  "jygl-spdj": {
    component: "TransmissionPrice",
  },
  // 降损反窃
  "jygl-jsfq": {
    component: "DecreaseSalesAndPurchase",
  },
  // 代理购电
  "jygl-flgd": {
    component: "AgentBuyPower",
  },
  // 线路跳闸
  "khfu-xltz": {
    component: "LineTrip",
  },
  // 供电可靠性
  "khfu-gdkkx": {
    component: "PowerSupplyReliability",
  },
  // 电压合格率
  "khfu-dyhgl": {
    component: "VoltageQualificationRate",
  },
  // 客户投诉
  "khfu-khts": {
    component: "CustomerComplaints",
  },
  // 主要经营指标及企业负责人关键指标
  "tydb-zyjjzb": {
    component: "KeyIndicators",
  },
  // 管理提升对标季度排名
  "tydb-dbjdpm": {
    component: "BenchmarkingQuarterlyRankings",
  },
  // 管理提升对标年度排名
  "tydb-dbndpm": {
    component: "BenchmarkingAnnualRankings",
  },
};
export const menu = [
  {
    categoryName: "安全生产",
    categoryId: "aqsc",
    categoryToggle: false,
  },
  {
    categoryName: "经营管理",
    categoryId: "jygl",
    categoryToggle: false,
  },
  {
    categoryName: "客户服务",
    categoryId: "khfu",
    categoryToggle: false,
  },
  {
    categoryName: "同业对标",
    categoryId: "tydb",
    categoryToggle: false,
  },
];

export enum MENU_ICON {
  aqsc = "safe_production", // 安全生产
  jygl = "business_management", // 经营管理
  khfu = "customer_service", // 客户服务
  tydb = "peer_benchmarking", // 同业对标
}

export enum CUSTOM_DATA_PERMISSION_TYPE {
  ALL = 8, //全部
  COMPANY = 4, //单位
}
