import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import cloneDeep from "lodash/cloneDeep";

import { useOverviewIndicatorsStore } from "@/stores/overviewIndicators";

type TooltipFormatter = string | ((params: any) => string);
dayjs.extend(utc);

const overviewIndicatorsStore = useOverviewIndicatorsStore();

export function formatUTC(utcString: string, format = "YYYY-MM-DD HH:mm:ss") {
  const res = dayjs.utc(utcString).utcOffset(8).format(format);
  return res;
}

export function formatTime(
  timeString: string | number,
  format = "YYYY-MM-DD HH:mm:ss"
) {
  let res: number | string = "";
  if (timeString) res = dayjs(timeString).format(format);
  else res = "";

  return res;
}

// 清空cookie
export function clearCookie() {
  const keys = document.cookie.match(/[^ =;]+(?==)/g);

  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = `${keys[i]}=0;path=/;expires=${new Date(
        0
      ).toUTCString()}`; // 清除当前域名下的,例如：m.kevis.com
      document.cookie = `${keys[i]}=0;path=/;domain=${
        document.domain
      };expires=${new Date(0).toUTCString()}`; // 清除当前域名下的，例如 .m.kevis.com
      document.cookie = `${
        keys[i]
      }=0;path=/;domain=kevis.com;expires=${new Date(0).toUTCString()}`; // 清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}

export function formatExecuteTime(milliseconds: number) {
  switch (true) {
    case milliseconds >= 3600000:
      return `${(milliseconds / 3600000).toFixed(1)}小时`;
    case milliseconds >= 60000:
      return `${(milliseconds / 60000).toFixed(1)}分钟`;
    case milliseconds >= 1000:
      return `${(milliseconds / 1000).toFixed(1)}秒`;
    default:
      return `${milliseconds}毫秒`;
  }
}

// js将数字转换成万 并且保留两位小数
export function numAddUnit(num: number) {
  let s_x = "";

  if (num > 10000) {
    let result = num / 10000;
    result = Math.floor(result * 100) / 100;
    s_x = result.toString(); // 将数字转换为字符串
    let pos_decimal = s_x.indexOf("."); // 小数点的索引值

    // 当整数时，pos_decimal=-1 自动补0
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += ".";
    }
    // 当数字的长度< 小数点索引+2时，补0
    while (s_x.length <= pos_decimal + 2) s_x += "0";

    s_x += "万";
  } else {
    s_x = String(num);
  }
  return s_x;
}

export function phoneFormat(visible: boolean, phone?: string) {
  let decryptPhone = phone;
  if (phone && phone.length > 11) decryptPhone = String(phone);

  if (visible)
    return decryptPhone?.length
      ? decryptPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
      : "";
  else return decryptPhone;
}

export const tooltipFormatter: TooltipFormatter = (params) => {
  const isPush: string[] = [];
  let tooltipHtml = `<div style="color: #fff; font-size:24; padding: 10; border-radius: 5px;border-image: linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(0, 168, 221, 0.79)) 2 2;">`;
  tooltipHtml += `<div style="margin-bottom: 24}">${params[0].axisValueLabel}</div>`;

  // 自定义前面图形
  for (let i = 0; i < params.length; i++) {
    const dataItem = params[i];

    if (
      dataItem.data !== "-" &&
      !isPush.includes(dataItem.seriesName) &&
      dataItem.seriesName &&
      dataItem.data !== null
    ) {
      isPush.push(dataItem.seriesName);
      tooltipHtml += `<div style="display: flex; margin: 10 0;align-items: center ;"><div style=" width: 12; height: 24; background-color: ${
        typeof dataItem.color === "object"
          ? dataItem.color.colorStops[0].color
          : dataItem.color
      }; margin-right: 15;"></div>`;
      tooltipHtml += `<div style=" text-align: left;vertical-align: middle;">${dataItem.seriesName}: ${dataItem.data}</div></div>`;
    }
  }
  tooltipHtml += "</div>";
  return tooltipHtml;
};

export function areaCodeFormat(
  dataList: string[],
  keyName: string,
  type: "V1" | "V2" | "V3" | "v4" | "V5" = "V1"
) {
  // V5 该模式只在经营管理的交流电压分压线损率下使用
  let areaList = [];
  switch (type) {
    case "V1":
      areaList = overviewIndicatorsStore.areaDataList;
      break;
    case "V2":
      areaList = overviewIndicatorsStore.areaDataV2List;
      break;
    case "V3":
      areaList = overviewIndicatorsStore.areaDataV3List;
      break;
    case "v4":
      areaList = overviewIndicatorsStore.areaDataV4List;
      break;
    case "V5":
      areaList = cloneDeep(overviewIndicatorsStore.areaDataList);
      areaList.push({
        companyAlias: "重庆电力",
        companyCode: "50101",
        companyName: "国网重庆市电力公司",
        companyShortName: "国网重庆电力公司",
        label: "国网重庆市电力公司",
        value: "50101",
      });
      break;
  }
  const xData = dataList.map((item: string) => {
    return (
      areaList.find((areaDataItem) => areaDataItem[keyName] === item) || item
    );
  });
  if (xData && xData.length && xData.join("")) {
    return xData.map((item: string) => item.companyAlias ?? item);
  } else {
    return dataList;
  }
}
