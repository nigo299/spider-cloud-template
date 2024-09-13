import Api from '../axios'
import type {
  DictCompanyDataVO,
  DictDataByTypeQueryDTO,
  DictDataByTypeQueryVO,
} from '@/interface/indicator'
import type { ElectricitySaleAveragePriceVO, LineLossRateTrendMode, LineLossRateTrendParams, LossV1QueryMode, LossV1QueryParams, PurchaseElectricityDTO, PurchaseElectricityVO, TElectricitySaleAveragePriceDTO, TrendPartitionMode, TrendPartitionParams, V1LossLineMode, V1LossLineParams } from '@/interface/indicator/comprehensiveLineLoss'
import type {
  CustomerComplaintsCategoryDTO,
  CustomerComplaintsCategoryVO,
  CustomerComplaintsCompanyRankDTO,
  CustomerComplaintsCompanyRankVO,
  CustomerComplaintsUnitDistributionDTO,
  CustomerComplaintsUnitDistributionVO,
} from '@/interface/indicator/customerComplaints'
import type {
  CompanyStatisticsMode,
  CompanyStatisticsParams,
  DeptStatisticsMode,
  DeptStatisticsParams,
  ListByCompanyMode,
  ListByCompanyParams,
  UserStatisticsMode,
  UserStatisticsParams,
  VoltageIndexMode,
  VoltageIndexParams,
} from '@/interface/indicator/customerService'
import type {
  SubstationStatusMode,
  SubstationStatusParams,
  SubstationTrendMode,
  SubstationTrendParams,
  SuccessRateMode,
  SuccessRateParams,
} from '@/interface/indicator/distributionDynamics'
import type {
  BusinessManagementElectricityChargeDTO,
  BusinessManagementElectricityMonitoringVO,
  BusinessManagementElectricityRateReturnVO,
  BusinessManagementElectricitySalesTypeVO,
  BusinessManagementInterestBearingLiabilitiesDTO,
  BusinessManagementInterestBearingLiabilitiesVO,
  BusinessManagementOperatingCashRatioDTO,
  BusinessManagementOperatingCashRatioVO,
  BusinessManagementProfitDTO,
  BusinessManagementProfitVO,
  DispatchKunyuLineMode,
  DispatchKunyuLineParams,
} from '@/interface/indicator/electricityConsumptionCost'
import type { TargetListDTO, TargetListVO } from '@/interface/indicator/indicatorSpecification'
import type {
  CustomerLineTripDistributionLineOutageRecordsDTO,
  CustomerLineTripDistributionLineOutageRecordsVO,
  FaultOutageNumMode,
  FaultOutageNumParams,
  LineTripFaultOutageRate110kvMode,
  LineTripFaultOutageRate110kvParams,
} from '@/interface/indicator/lineTrip'
import type {
  PowerDispatchMode,
  PowerDispatchQueryParams,
} from '@/interface/indicator/powerGRSituation'
import type {
  FailureElectricQueryParams,
  PowerOutage,
  UserDistribution,
  UserDistributionQueryParams,
} from '@/interface/indicator/powerOutage'
import type {
  ElectricityAccuracyDTO,
  ElectricityAccuracyVO,
  LossRateV1QueryMode,
  LossRateV1QueryParams,
  OperationRateV1QueryMode,
  OperationRateV1QueryParams,
  PurchaseAveragePriceDTO,
  PurchaseAveragePriceVO,
  RateV1QueryMode,
  RateV1QueryParams,
  TransmissionDistributionPriceDTO,
  TransmissionDistributionPriceVO,
} from '@/interface/indicator/predictionAccuracy'
import type {
  DistributionLinesMode,
  DistributionLinesParams,
  DistributionSituationMode,
  DistributionSituationParams,
  LineLengthNumberMode,
  LineLengthNumberParams,
  StatisticsMode,
  StatisticsParams,
  TransformerCompanyMode,
  TransformerCompanyParams,
  TransformerMode,
  TransformerParams,
} from '@/interface/indicator/runningEquipmentScale'
import type {
  ElectricitySalesCountDTO,
  ElectricitySalesCountVO,
  ElectricitySalesGrowthDTO,
  ElectricitySalesGrowthVO,
  FilureOutageRateByThreeYearsMode,
  FilureOutageRateByThreeYearsParams,
  FilureOutageRateByYearMode,
  FilureOutageRateByYearParams,
  IndustrySalesGrowthDTO,
  IndustrySalesGrowthVO,
  IndustryTreeListVO,
  UnitSalesGrowthDTO,
  UnitSalesGrowthVO,
  WholeSocietySalesGrowthDTO,
  WholeSocietySalesGrowthVO,
} from '@/interface/indicator/salesVolume'
import type { SidebarMenuVO } from '@/interface/indicator/siderbarMenu'
import type {
  ViolationSpecialtyDistributionDTO,
  ViolationSpecialtyDistributionVO,
  ViolationTrendsDTO,
  ViolationTrendsVO,
  ViolationUnitDistributionDTO,
  ViolationUnitDistributionVO,
} from '@/interface/indicator/violentUnits'
import type {
  AnnualBenchmarkMode,
  AnnualBenchmarkParams,
  ContributionEvaluateMode,
  ContributionEvaluateParams,
  LineLossCompanyMode,
  LineLossCompanyParams,
  LineLossYearMode,
  LineLossYearParams,
  QuarterRankComprehensiveMode,
  QuarterRankComprehensiveParams,
  QuarterRankMajorMode,
  QuarterRankMajorParams,
  RankComprehensiveMode,
  RankComprehensiveParams,
  ResultsEvaluateMode,
  ResultsEvaluateParams,
  V1CumulativeEffectCompanyMode,
  V1CumulativeEffectCompanyParams,
  V1CumulativeEffectMonthMode,
  V1CumulativeEffectMonthParams,
  V1DailyLineLossMode,
  V1DailyLineLossParams,
  V1LossCompanyMode,
  V1LossCompanyParams,
  V1LossYearMode,
  V1LossYearParams,
} from '@/interface/indicator/reduceDamageCounter'
import type { DistributedPhotovoltaicByDimensionDTO, DistributedPhotovoltaicByDimensionVO } from '@/interface/indicator/distributedPhotovoltaic'

import type { AveragePriceDTO, AveragePriceVO } from '@/interface/indicator/averagePurchaseAndSalePrice'
/**
 * 安全生产 - 调度负荷
 */

/**
 * 负荷查询参数接口
 */
interface LoadQueryParams {
  /** 区域代码 */
  areaCode?: string
  /** 结束时间 */
  endTime?: string
  /** 开始时间 */
  startTime?: string
}

/**
 * 负荷响应数据接口
 */
export interface LoadResponseData {
  /** 负荷率 */
  loadRate: number
  /** 月份 */
  month: number
  /** 同比 */
  proportion: number
  /** 年份 */
  year: number
}

interface IBaseInfo {
  /** 区县code */
  areaCode?: string
}

export interface IBaseInfoResponse {
  /**
   * 区域代码
   * 参照字典表cq_area
   */
  areaCode: string

  /**
   * 最大负荷 (单位：MW)
   */
  maxLoad: number

  /**
   * 最大负荷发生时间
   * @format date-time
   */
  maxLoadHappenTime: string

  /**
   * 最小负荷 (单位：MW)
   */
  minLoad: number

  /**
   * 最小负荷发生时间
   * @format date-time
   */
  minLoadHappenTime: string

  /**
   * 时间类型
   * - 'yesterday': 昨日
   * - 'week': 本周
   * - 'month': 本月
   * - 'year': 本年
   */
  timeType: 'yesterday' | 'week' | 'month' | 'year'
}

interface SafeDispatchMaxLoadDTO {
  /** 区域代码 */
  areaCode?: string
  /**
   * 结束时间
   * 举例 年 2023 ，月 2023-01 ，日 2023-01-01
   */
  endTime?: string
  /**
   * 开始时间
   * 举例 年 2023 ，月 2023-01 ，日 2023-01-01
   */
  startTime?: string
}

export interface SafeDispatchMaxLoadVO {
  /** 负荷 */
  loadData: number
  /** 月 */
  month: number
  /** 年 */
  year: number
}

export interface SafeDispatchPhotovoltaicDTO {
  /** 区县code */
  areaCode?: string
  /**
   * 光伏类型
   * - 'contract': 合同容量
   * - 'number': 光伏数量
   */
  scaleType?: 'contract' | 'number'
}

export interface SafeDispatchPhotovoltaicVO {
  powerStationName: string
  /** 区县code */
  areaCode: string
  /** 合同容量/光伏数量 */
  capacity: number
  /**
   * 光伏类型
   * - 'contract': 合同容量
   * - 'number': 光伏数量
   */
  scaleType: 'contract' | 'number'
}

/**
 * 获取调度月平均负荷率全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为负荷响应数据
 */
export async function getAverageLoad(params: LoadQueryParams): Promise<LoadResponseData[]> {
  const response = await Api.post<LoadResponseData[]>('/safe/dispatch/load/v1/average-load', params)
  return response.data
}

/**
 * 获取调度负荷基本情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为负荷响应数据
 */
export async function getBaseInfo(params: IBaseInfo): Promise<IBaseInfoResponse[]> {
  const response = await Api.post<IBaseInfoResponse[]>('/safe/dispatch/load/v1/base-info', params)
  return response.data
}

/**
 * 获取光伏规模数据
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getPhotovoltaicScale(
  params: SafeDispatchPhotovoltaicDTO,
): Promise<SafeDispatchPhotovoltaicVO[]> {
  const response = await Api.post<SafeDispatchPhotovoltaicVO[]>(
    '/safe/dispatch/load/v1/photovoltaic',
    params,
  )
  return response.data
}

/**
 * 停复电情况（计划/故障）
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getFailureElectric(
  params: FailureElectricQueryParams,
): Promise<PowerOutage[]> {
  const response = await Api.post<PowerOutage[]>('/safe/power/v1/failure-electric', params)
  return response.data
}

/**
 * 停电用户数分布情况（计划/故障）
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getUserDistribution(
  params: UserDistributionQueryParams,
): Promise<UserDistribution[]> {
  const response = await Api.post<UserDistribution[]>('/safe/power/v1/user-distribution', params)
  return response.data
}

/**
 * 调度实时发受电情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getPowerDispatch(params: PowerDispatchQueryParams) {
  const response = await Api.post<PowerDispatchMode[]>(
    '/safe/dispatch/real/time/dispatch/v1/power_dispatch',
    params,
  )
  return response.data
}

/**
 * 获取侧边栏菜单数据
 *
 * @returns Promise，解析为侧边栏菜单数据
 */
export async function getSidebarMenuData(): Promise<SidebarMenuVO[]> {
  const response = await Api.post<SidebarMenuVO[]>('/sidebar/menu/v1/menu-data')
  return response.data
}

/**
 * 获取调度最高负荷全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getMaxLoad(params: SafeDispatchMaxLoadDTO) {
  const response = await Api.post<SafeDispatchMaxLoadVO[]>(
    '/safe/dispatch/load/v1/max-load',
    params,
  )
  return response.data
}

/**
 * 根据字典类型查询字典
 *
 * @param params - 查询参数
 * @returns Promise，解析为字典数据列表
 */
export async function getDictDataByType(
  params: DictDataByTypeQueryDTO,
): Promise<DictDataByTypeQueryVO[]> {
  const response = await Api.post<DictDataByTypeQueryVO[]>('/dict/v1/data/list-by-type', params)
  return response.data
}

/**
 * 根查询公司参数
 *
 * @param params - 查询参数
 * @returns Promise，解析为字典数据列表
 */
export async function getCompanyData(): Promise<DictCompanyDataVO[]> {
  const response = await Api.post<DictCompanyDataVO[]>('/dict/v1/company/list')
  return response.data
}

/**
 * 根查询公司参数v2
 *
 * @param params - 查询参数
 * @returns Promise，解析为字典数据列表
 */
export async function getCompanyDataV2(): Promise<DictCompanyDataVO[]> {
  const response = await Api.post<DictCompanyDataVO[]>('/dict/v2/company/list')
  return response.data
}

/**
 * 根查询公司参数v3
 *
 * @param params - 查询参数
 * @returns Promise，解析为字典数据列表
 */
export async function getCompanyDataV3(): Promise<DictCompanyDataVO[]> {
  const response = await Api.post<DictCompanyDataVO[]>('/dict/v3/company/list')
  return response.data
}
/**
 * 根查询公司参数v4
 *
 * @param params - 查询参数
 * @returns Promise，解析为字典数据列表
 */
export async function getCompanyDataV4(): Promise<DictCompanyDataVO[]> {
  const response = await Api.post<DictCompanyDataVO[]>('/customer/complaints/v1/complaints_company_dict')
  return response.data
}

/**
 * 输电线路数量（回）、长度（公里
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getLineLengthNumber(params: LineLengthNumberParams) {
  const response = await Api.post<LineLengthNumberMode[]>(
    '/oes/v1/transmission/line-and-length',
    params,
  )
  return response.data
}

/**
 * 变电站数量、主变数量及容量
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getStatistics(params: StatisticsParams) {
  const response = await Api.post<StatisticsMode[]>(
    '/oes/v1/substation/and/main-transformer/statistics/new',
    params,
  )
  return response.data
}

/**
 * 配变数量及容量
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getTransformer(params: TransformerParams) {
  const response = await Api.post<TransformerMode[]>('/oes/v1/distribution/transformer', params)
  return response.data
}

/**
 * 配变数量及容量（按单位）
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getTransformerCompany(params: TransformerCompanyParams) {
  const response = await Api.post<TransformerCompanyMode[]>('/oes/v1/distribution/transformer/company', params)
  return response.data
}

/**
 * 配电线路条数及公里数
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getDistributionLines(params: DistributionLinesParams) {
  const response = await Api.post<DistributionLinesMode[]>('/oes/v1/distribution/lines/new', params)
  return response.data
}
/**
 * 配网设备情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为配网设备情况
 */
export async function getDistributionSituation(params: DistributionSituationParams) {
  const response = await Api.post<DistributionSituationMode[]>('/oes/v1/distribution/situation', params)
  return response.data
}

/**
 * 获取违章单位分布
 *
 * @param params - 查询参数
 * @returns Promise，解析为违章单位分布响应数据
 */
export async function getViolationUnitDistribution(
  params: ViolationUnitDistributionDTO,
): Promise<ViolationUnitDistributionVO[]> {
  const response = await Api.post<ViolationUnitDistributionVO[]>(
    '/violation/v1/unit/distribution',
    params,
  )
  return response.data
}

/**
 * 获取违章专业分布
 *
 * @param params - 查询参数
 * @returns Promise，解析为违章专业分布响应数据
 */
export async function getViolationSpecialtyDistribution(
  params: ViolationSpecialtyDistributionDTO,
): Promise<ViolationSpecialtyDistributionVO[]> {
  const response = await Api.post<ViolationSpecialtyDistributionVO[]>(
    '/violation/v1/specialty/distribution',
    params,
  )
  return response.data
}

/**
 * 获取全年违章趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为违章趋势响应数据
 */
export async function getAnnualViolationTrends(
  params: ViolationTrendsDTO,
): Promise<ViolationTrendsVO[]> {
  const response = await Api.post<ViolationTrendsVO[]>('/violation/v1/annual/trends', params)
  return response.data
}

/**
 * 台区情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getSubstationStatus(params: SubstationStatusParams) {
  const response = await Api.post<SubstationStatusMode[]>(
    '/safe/dispatch/transforme/operation/dynamics/v1/substation_status',
    params,
  )
  return response.data
}

/**
 * 台区趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getSubstationTrend(params: SubstationTrendParams) {
  const response = await Api.post<SubstationTrendMode[]>(
    '/safe/dispatch/transforme/operation/dynamics/v1/substation_trend',
    params,
  )
  return response.data
}

/**
 * 台区趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getSuccessRate(params: SuccessRateParams) {
  const response = await Api.post<SuccessRateMode[]>(
    '/safe/dispatch/acquisition/success/rate/v1/success/rate',
    params,
  )
  return response.data
}

/**
 * 获取配网线路故障停运情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为配网线路故障停运情况响应数据
 */
export async function getDistributionLineOutageRecords(
  params: CustomerLineTripDistributionLineOutageRecordsDTO,
): Promise<CustomerLineTripDistributionLineOutageRecordsVO[]> {
  const response = await Api.post<CustomerLineTripDistributionLineOutageRecordsVO[]>(
    '/customer/line-trip/v1/distribution/line/outage/records',
    params,
  )
  return response.data
}

/**
 * 获取本年度故障停运频次
 *
 * @param params - 查询参数
 * @returns Promise，解析为本年度故障停运频次响应数据
 */
export async function getFaultOutageFrequency(
  params: FaultOutageNumParams,
): Promise<FaultOutageNumMode[]> {
  const response = await Api.post<FaultOutageNumMode[]>(
    '/customer/line-trip/v1/fault-outage-frequency',
    params,
  )
  return response.data
}

/**
 * 110千伏及以上输电线路故障停运率
 *
 * @param params - 查询参数
 * @returns Promise，解析为本年度故障停运频次响应数据
 */
export async function get110FaultOutageCount(
  params: LineTripFaultOutageRate110kvParams,
): Promise<LineTripFaultOutageRate110kvMode[]> {
  const response = await Api.post<LineTripFaultOutageRate110kvMode[]>(
    '/customer/line-trip/v1/line-trip-fault-outage-rate-110kv',
    params,
  )
  return response.data
}

/**
 * 获取公司客户投诉分类情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为公司客户投诉分类情况响应数据
 */

// ToDo complaints_category 改为 complaints_category_new
export async function getComplaintsCategory(
  params: CustomerComplaintsCategoryDTO,
): Promise<CustomerComplaintsCategoryVO[]> {
  const response = await Api.post<CustomerComplaintsCategoryVO[]>(
    '/customer/complaints/v1/complaints_category_new',
    params,
  )
  return response.data
}
// 旧的
export async function getComplaintsCategoryTodo(
  params: CustomerComplaintsCategoryDTO,
): Promise<CustomerComplaintsCategoryVO[]> {
  const response = await Api.post<CustomerComplaintsCategoryVO[]>(
    '/customer/complaints/v1/complaints_category',
    params,
  )
  return response.data
}
/**
 * 中压用户供电可靠性统计
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getUserStatistics(params: UserStatisticsParams) {
  const response = await Api.post<UserStatisticsMode[]>(
    '/customer/reliability/v1/user-statistics',
    params,
  )
  return response.data
}

/**
 * 中压用户供电可靠性统计-按单位
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getCompanyStatistics(params: CompanyStatisticsParams) {
  const response = await Api.post<CompanyStatisticsMode[]>(
    '/customer/reliability/v1/company-statistics',
    params,
  )
  return response.data
}

/**
 * 中压用户供电可靠性统计-单位统计
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getDeptStatistics(params: DeptStatisticsParams) {
  const response = await Api.post<DeptStatisticsMode[]>(
    '/customer/reliability/v1/dept-statistics',
    params,
  )
  return response.data
}

/**
 * 全口径电压指数
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getVoltageIndex(params: VoltageIndexParams) {
  const response = await Api.post<VoltageIndexMode[]>(
    '/customer/voltage-compliance-rate/v1/comprehensive/voltage/index',
    params,
  )
  return response.data
}
/**
 * 全口径电压指数-bottom
 *
 * @param params - 查询参数
 * @returns Promise，解析为API响应数据
 */
export async function getListByCompany(params: ListByCompanyParams) {
  const response = await Api.post<ListByCompanyMode>(
    '/customer/voltage-compliance-rate/v1/comprehensive/voltage/list-by-company',
    params,
  )
  return response.data
}

/**
 * 获取客户投诉件次地市单位分布
 *
 * @param params - 查询参数
 * @returns Promise，解析为客户投诉件次地市单位分布响应数据
 */
// ToDo 把unit_distribution 改为unit_distribution_new
export async function getUnitDistribution(
  params: CustomerComplaintsUnitDistributionDTO,
): Promise<CustomerComplaintsUnitDistributionVO[]> {
  const response = await Api.post<CustomerComplaintsUnitDistributionVO[]>(
    '/customer/complaints/v1/unit_distribution_new',
    params,
  )
  return response.data
}
// 旧的
export async function getUnitDistributionTodo(
  params: CustomerComplaintsUnitDistributionDTO,
): Promise<CustomerComplaintsUnitDistributionVO[]> {
  const response = await Api.post<CustomerComplaintsUnitDistributionVO[]>(
    '/customer/complaints/v1/unit_distribution',
    params,
  )
  return response.data
}

/**
 * 获取地市公司每十万客户投诉件次排名
 *
 * @param params - 查询参数
 * @returns Promise，解析为地市公司每十万客户投诉件次排名响应数据
 */
// ToDo 把company_rank_new 改为company_rank
export async function getCompanyRank(
  params: CustomerComplaintsCompanyRankDTO,
): Promise<CustomerComplaintsCompanyRankVO[]> {
  const response = await Api.post<CustomerComplaintsCompanyRankVO[]>(
    '/customer/complaints/v1/company_rank_new',
    params,
  )
  return response.data
}
// 旧的
export async function getCompanyRankTodo(
  params: CustomerComplaintsCompanyRankDTO,
): Promise<CustomerComplaintsCompanyRankVO[]> {
  const response = await Api.post<CustomerComplaintsCompanyRankVO[]>(
    '/customer/complaints/v1/company_rank',
    params,
  )
  return response.data
}
/**
 * 获取售电量-售电增速全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电量-售电增速全年趋势
 */
export async function getElectricitySalesGrowth(
  params: ElectricitySalesGrowthDTO,
): Promise<ElectricitySalesGrowthVO[]> {
  const response = await Api.post<ElectricitySalesGrowthVO[]>(
    '/business/management/electricity/sales/v1/electricity_sales_growth',
    params,
  )
  return response.data
}

/**
 * 经营管理-售电量-全年累计售电量
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电量-售电增速全年趋势
 */
export async function getElectricitySalesCount(
  params: ElectricitySalesCountDTO,
): Promise<ElectricitySalesCountVO[]> {
  const response = await Api.post<ElectricitySalesCountVO[]>(
    '/business/management/electricity/sales/v1/electricity_sales_count',
    params,
  )
  return response.data
}

/**
 * 获取售电增速单位对比
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电增速单位对比响应数据
 */
export async function getUnitSalesGrowth(params: UnitSalesGrowthDTO): Promise<UnitSalesGrowthVO[]> {
  const response = await Api.post<UnitSalesGrowthVO[]>(
    '/business/management/electricity/sales/v1/unit_sales_growth',
    params,
  )
  return response.data
}

/**
 * 获取售电量-售电增速行业对比(全行业用电)
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电量-售电增速行业对比响应数据
 */
export async function getIndustrySalesGrowth(
  params: IndustrySalesGrowthDTO,
): Promise<IndustrySalesGrowthVO[]> {
  const response = await Api.post<IndustrySalesGrowthVO[]>(
    '/business/management/electricity/sales/v1/industry_sales_growth',
    params,
  )
  return response.data
}

/**
 * 变电设备故障停运率3年
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电量-售电增速行业对比响应数据
 */
export async function getFilureOutageRateByThreeYears(
  params: FilureOutageRateByThreeYearsParams,
): Promise<FilureOutageRateByThreeYearsMode[]> {
  const response = await Api.post<FilureOutageRateByThreeYearsMode[]>(
    '/safe/electricity/failure_outage_rate/v1/filureOutageRateByYear',
    params,
  )
  return response.data
}

/**
 * 变电设备故障停运率3年
 *
 * @param params - 查询参数
 * @returns Promise，解析为售电量-售电增速行业对比响应数据
 */
export async function getFilureOutageRateByYear(
  params: FilureOutageRateByYearParams,
): Promise<FilureOutageRateByYearMode[]> {
  const response = await Api.post<FilureOutageRateByYearMode[]>(
    '/safe/electricity/failure_outage_rate/v1/filureOutageRateByYear',
    params,
  )
  return response.data
}

/**
 * 获取电费回收率
 *
 * @param params - 查询参数
 * @returns Promise，解析为电费回收率响应数据
 */
export async function getElectricityRate(
  params: BusinessManagementElectricityChargeDTO,
): Promise<BusinessManagementElectricityRateReturnVO[]> {
  const response = await Api.post<BusinessManagementElectricityRateReturnVO[]>(
    '/business/management/electricity/charge/v1/electricity_rate',
    params,
  )
  return response.data
}

/**
 * 获取电费监测
 *
 * @param params - 查询参数
 * @returns Promise，解析为电费监测响应数据
 */
export async function getElectricityMonitoring(
  params: BusinessManagementElectricityChargeDTO,
): Promise<BusinessManagementElectricityMonitoringVO> {
  const response = await Api.post<BusinessManagementElectricityMonitoringVO>(
    '/business/management/electricity/charge/v1/electricity_rate_monitoring',
    params,
  )
  return response.data
}

/**
 * 获取分类售电量
 *
 * @param params - 查询参数
 * @returns Promise，解析为分类售电量响应数据
 */
export async function getElectricitySalesType(
  params: BusinessManagementElectricityChargeDTO,
): Promise<BusinessManagementElectricitySalesTypeVO> {
  const response = await Api.post<BusinessManagementElectricitySalesTypeVO>(
    '/business/management/electricity/charge/v1/electricity_sales_type',
    params,
  )
  return response.data
}

/**
 * 获取净资产收益率
 *
 * @param params - 查询参数
 * @returns Promise，解析为净资产收益率响应数据
 */
export async function getEquityRate(
  params: BusinessManagementProfitDTO,
): Promise<BusinessManagementProfitVO[]> {
  const response = await Api.post<BusinessManagementProfitVO[]>(
    '/business/management/profit/v1/equity',
    params,
  )
  return response.data
}

/**
 * 获取利润总额
 *
 * @param params - 查询参数
 * @returns Promise，解析为利润总额响应数据
 */
export async function getProfit(
  params: BusinessManagementProfitDTO,
): Promise<BusinessManagementProfitVO[]> {
  const response = await Api.post<BusinessManagementProfitVO[]>(
    '/business/management/profit/v1/totalprofit',
    params,
  )
  return response.data
}

/**
 * 获取带息负债余额
 *
 * @param params - 查询参数
 * @returns Promise，解析为带息负债余额响应数据
 */
export async function getInterestBearingLiabilitiesBalance(
  params: BusinessManagementInterestBearingLiabilitiesDTO,
): Promise<BusinessManagementInterestBearingLiabilitiesVO[]> {
  const response = await Api.post<BusinessManagementInterestBearingLiabilitiesVO[]>(
    '/business/management/interest/bearingliabilities/v1/balance',
    params,
  )
  return response.data
}

/**
 * 获取带息负债率
 *
 * @param params - 查询参数
 * @returns Promise，解析为带息负债率响应数据
 */
export async function getInterestBearingLiabilitiesDebt(
  params: BusinessManagementOperatingCashRatioDTO,
): Promise<BusinessManagementInterestBearingLiabilitiesVO[]> {
  const response = await Api.post<BusinessManagementInterestBearingLiabilitiesVO[]>(
    '/business/management/interest/bearingliabilities/v1/debt',
    params,
  )
  return response.data
}

/**
 * 获取营业现金比率
 *
 * @param params - 查询参数
 * @returns Promise，解析为营业现金比率响应数据
 */
export async function getOperatingCashRatio(
  params: BusinessManagementOperatingCashRatioDTO,
): Promise<BusinessManagementOperatingCashRatioVO[]> {
  const response = await Api.post<BusinessManagementOperatingCashRatioVO[]>(
    '/business/management/operating/cash/ratio/v1/rateByYear',
    params,
  )
  return response.data
}

/**
 * 特高压坤渝线负荷
 *
 * @param params - 查询参数
 * @returns Promise，解析为营业现金比率响应数据
 */
export async function getDispatchKunyuLine(
  params: DispatchKunyuLineParams,
): Promise<DispatchKunyuLineMode[]> {
  const response = await Api.post<DispatchKunyuLineMode[]>(
    '/safe/dispatch/real/time/dispatch/v1/dispatch-kunyu-line',
    params,
  )
  return response.data
}

/**
 * 指标说明查询
 *
 * @param params - 查询参数
 * @returns Promise，解析为指标说明数据
 */
export async function getTargetList(params: TargetListDTO): Promise<TargetListVO> {
  const response = await Api.post<TargetListVO>('/sidebar/menu/v1/target-list', params)
  return response.data
}

/**
 * 经营管理-综合线损-综合线损率全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为营综合线损率数据
 */
export async function getLineLossRateTrend(
  params: LineLossRateTrendParams,
): Promise<LineLossRateTrendMode[]> {
  const response = await Api.post<LineLossRateTrendMode[]>(
    '/business/management/line_loss_rate/v1/trend',
    params,
  )
  return response.data
}

/**
 * 经营管理-综合线损-分区线损率全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为分区线损率全年趋势数据
 */
export async function getTrendPartition(
  params: TrendPartitionParams,
): Promise<TrendPartitionMode[]> {
  const response = await Api.post<TrendPartitionMode[]>(
    '/business/management/line_loss_rate/v1/trend_partition',
    params,
  )
  return response.data
}
/**
 * 经营管理-综合线损-主网高损线损治理情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为主网高损线损治理情况数据
 */
export async function getLossV1Query(
  params: LossV1QueryParams,
): Promise<LossV1QueryMode[]> {
  const response = await Api.post<LossV1QueryMode[]>(
    '/business/management/main/network/high/loss/line/loss/v1/query',
    params,
  )
  return response.data
}
/**
 * 经营管理-综合线损-10kV或400kv高损线路治理情况
 *
 * @param params - 查询参数
 * @returns Promise，解析为10kV或400kv高损线路治理情况
 */
export async function getV1LossLine(
  params: V1LossLineParams,
): Promise<V1LossLineMode[]> {
  const response = await Api.post<V1LossLineMode[]>(
    '/business/management/high/loss/area/governance/report/v1/high/loss/line',
    params,
  )
  return response.data
}

/**
 * 经营管理-代理购电-省间现货购电均价
 *
 * @param params - 查询参数
 * @returns Promise，解析为省间现货购电均价数据
 */
export async function getElectricitySaleAveragePrice(
  params: TElectricitySaleAveragePriceDTO,
): Promise<ElectricitySaleAveragePriceVO[]> {
  const response = await Api.post<ElectricitySaleAveragePriceVO[]>(
    '/business/management/purchase/electricity/v1/sale/average/price',
    params,
  )
  return response.data
}

/**
 * 经营管理-代理购电-省间现货购电均价
 *
 * @param params - 查询参数
 * @returns Promise，解析为省间现货购电均价数据
 */
export async function getPurchaseElectricity(
  params: PurchaseElectricityDTO,
): Promise<PurchaseElectricityVO[]> {
  const response = await Api.post<PurchaseElectricityVO[]>(
    '/business/management/purchase/electricity/v1/purchase/electricity',
    params,
  )
  return response.data
}

/**
 * 经营管理-代理购电-代理购电电量预测准确率
 *
 * @param params - 查询参数
 * @returns Promise，解析为预测准确率数据
 */
export async function getElectricityAccuracy(
  params: ElectricityAccuracyDTO,
): Promise<ElectricityAccuracyVO[]> {
  const response = await Api.post<ElectricityAccuracyVO[]>(
    '/business/management/purchase/electricity/v1/prediction/accuracy',
    params,
  )
  return response.data
}

/**
 * 经营管理-综合线损-分区线损率合格情况
 *
 * @param params - 查询参数
 * @returns Promise，解析管理状态专业排名
 */

export async function getRateV1Query(
  params: RateV1QueryParams,
): Promise<RateV1QueryMode[]> {
  const response = await Api.post<RateV1QueryMode[]>(
    '/business/management/partition/line/loss/rate/v1/query',
    params,
  )
  return response.data
}
/**
 * 经营管理-综合线损-优化运行率查询
 *
 * @param params - 查询参数
 * @returns Promise，解析优化运行率查询
 */
export async function getOperationRateV1Query(
  params: OperationRateV1QueryParams,
): Promise<OperationRateV1QueryMode[]> {
  const response = await Api.post<OperationRateV1QueryMode[]>(
    '/business/management/optimized/operation/rate/v1/query',
    params,
  )
  return response.data
}
/**
 * 经营管理-综合线损-交流电压分压线损率
 *
 * @param params - 查询参数
 * @returns Promise，解析优化运行率查询
 */
export async function getLossRateV1Query(
  params: LossRateV1QueryParams,
): Promise<LossRateV1QueryMode[]> {
  const response = await Api.post<LossRateV1QueryMode[]>(
    '/business/management/ac/voltage/dividedd/line/loss/rate/v1/query',
    params,
  )
  return response.data
}

/**
 * 输配电价
 *
 * @param params - 查询参数
 * @returns Promise，解析为输配电价数据
 */
export async function getTransmissionDistributionPrice(
  params: TransmissionDistributionPriceDTO,
): Promise<TransmissionDistributionPriceVO[]> {
  const response = await Api.post<TransmissionDistributionPriceVO[]>(
    '/business/management/transmission/distribution/price/v1/transmission-distribution-price',
    params,
  )
  return response.data
}

/**
 * 输配电价
 *
 * @param params - 查询参数
 * @returns Promise，解析为输配电价数据
 */
export async function getPurchaseAveragePrice(
  params: PurchaseAveragePriceDTO,
): Promise<PurchaseAveragePriceVO[]> {
  const response = await Api.post<PurchaseAveragePriceVO[]>(
    '/business/management/purchase/sale/v1/average-price',
    params,
  )
  return response.data
}

/**
 * 经营管理-降损反窃-台区月线损率全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为降损反窃
 */
export async function getLineLossYear(
  params: LineLossYearParams,
): Promise<LineLossYearMode[]> {
  const response = await Api.post<LineLossYearMode[]>(
    '/business/management/reduce/v1/lineLossYear',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-台区月线损率同比
 *
 * @param params - 查询参数
 * @returns Promise，解析为降损反窃
 */
export async function getLineLossCompany(
  params: LineLossCompanyParams,
): Promise<LineLossCompanyMode[]> {
  const response = await Api.post<LineLossCompanyMode[]>(
    '/business/management/reduce/v1/lineLossCompany',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-月高损台区数全年趋势
 *
 * @param params - 查询参数
 * @returns Promise，解析为月高损台区数全年趋势
 */
export async function getV1LossYear(
  params: V1LossYearParams,
): Promise<V1LossYearMode[]> {
  const response = await Api.post<V1LossYearMode[]>(
    '/business/management/reduce/v1/lossYear',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-月高损台区数同比
 *
 * @param params - 查询参数
 * @returns Promise，解析月高损台区数同比
 */
export async function getV1LossCompany(
  params: V1LossCompanyParams,
): Promise<V1LossCompanyMode[]> {
  const response = await Api.post<V1LossCompanyMode[]>(
    '/business/management/reduce/v1/lossCompany',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-日线损合格率曲线
 *
 * @param params - 查询参数
 * @returns Promise，解析日线损合格率曲线
 */
export async function getV1DailyLineLoss(
  params: V1DailyLineLossParams,
): Promise<V1DailyLineLossMode[]> {
  const response = await Api.post<V1DailyLineLossMode[]>(
    '/business/management/reduce/v1/dailyLineLoss',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-年度反窃电累计成效(按月)
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按月)
 */
export async function getV1CumulativeEffectMonth(
  params: V1CumulativeEffectMonthParams,
): Promise<V1CumulativeEffectMonthMode[]> {
  const response = await Api.post<V1CumulativeEffectMonthMode[]>(
    '/business/management/reduce/v1/cumulativeEffectMonth',
    params,
  )
  return response.data
}
/**
 * 经营管理-降损反窃-年度反窃电累计成效(按单位)
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按单位)
 */
export async function getV1CumulativeEffectCompany(
  params: V1CumulativeEffectCompanyParams,
): Promise<V1CumulativeEffectCompanyMode[]> {
  const response = await Api.post<V1CumulativeEffectCompanyMode[]>(
    '/business/management/reduce/v1/cumulativeEffectCompany',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标年度排名-年度管理状态评价综合排名
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按单位)
 */
export async function getRankComprehensive(
  params: RankComprehensiveParams,
): Promise<RankComprehensiveMode[]> {
  const response = await Api.post<RankComprehensiveMode[]>(
    '/peer/year/v1/rank-comprehensive',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标年度排名-年度提升成效评价排名
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按单位)
 */
export async function getResultsEvaluate(
  params: ResultsEvaluateParams,
): Promise<ResultsEvaluateMode[]> {
  const response = await Api.post<ResultsEvaluateMode[]>(
    '/peer/year/v1/results-evaluate',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标年度排名-年度支撑贡献评价排名
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按单位)
 */
export async function getContributionEvaluate(
  params: ContributionEvaluateParams,
): Promise<ContributionEvaluateMode[]> {
  const response = await Api.post<ContributionEvaluateMode[]>(
    '/peer/year/v1/contribution-evaluate',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标年度排名-管理状态、提升成效、支撑贡献年度标杆
 *
 * @param params - 查询参数
 * @returns Promise，解析年度反窃电累计成效(按单位)
 */

export async function getAnnualBenchmark(
  params: AnnualBenchmarkParams,
): Promise<AnnualBenchmarkMode[]> {
  const response = await Api.post<AnnualBenchmarkMode[]>(
    '/peer/year/v1/annual-benchmark',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标季度排名-管理状态综合排名
 *
 * @param params - 查询参数
 * @returns Promise，解析管理状态综合排名
 */
export async function getQuarterRankComprehensive(
  params: QuarterRankComprehensiveParams,
): Promise<QuarterRankComprehensiveMode[]> {
  const response = await Api.post<QuarterRankComprehensiveMode[]>(
    '/peer/quarter/v1/rank-comprehensive',
    params,
  )
  return response.data
}
/**
 * 管理提升对标-管理提升对标季度排名-管理状态专业排名
 *
 * @param params - 查询参数
 * @returns Promise，解析管理状态专业排名
 */
export async function getQuarterRankMajor(
  params: QuarterRankMajorParams,
): Promise<QuarterRankMajorMode[]> {
  const response = await Api.post<QuarterRankMajorMode[]>(
    '/peer/quarter/v1/rank-major',
    params,
  )
  return response.data
}

/**
 * 购售电均价
 *
 * @param params - 查询参数
 * @returns Promise，解析为负荷响应数据
 */
export async function getAveragePrice(params: AveragePriceDTO): Promise<AveragePriceVO[]> {
  const response = await Api.post<AveragePriceVO[]>('/business/management/purchase/sale/v1/average-price', params)
  return response.data
}
/**
 * 安全生产-分布式光伏窃-按年
 *
 * @param params - 查询参数
 * @returns Promise
 */
export async function getDistributedPhotovoltaicByDimension(
  params: DistributedPhotovoltaicByDimensionDTO,
): Promise<DistributedPhotovoltaicByDimensionVO[]> {
  const response = await Api.post<DistributedPhotovoltaicByDimensionVO[]>(
    '/safe/distributed-photovoltaic/v1/list-by-dimension',
    params,
  )
  return response.data
}

/**
 * 经营管理-售电增速行业对比(全社会用电)
 *
 * @param params - 查询参数
 * @returns Promise
 */
export async function getWholeSocietySalesGrowth(
  params: WholeSocietySalesGrowthDTO,
): Promise<WholeSocietySalesGrowthVO[]> {
  const response = await Api.post<WholeSocietySalesGrowthVO[]>(
    '/business/management/electricity/sales/v1/whole-society-sales-growth',
    params,
  )
  return response.data
}

/**
 * 经营管理-售电量-获取行业列表
 *
 * @param params - 查询参数
 * @returns Promise
 */
export async function getIndustryTreeList(
): Promise<IndustryTreeListVO[]> {
  const response = await Api.post<IndustryTreeListVO[]>(
    '/business/management/electricity/sales/v1/industry-tree-list',
  )
  return response.data
}
