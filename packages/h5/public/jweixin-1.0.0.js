!function (a, b) { "function" != typeof define || !define.amd && !define.cmd || window.requirejs ? b(a, !0) : define("js/wwopen/jsapi/jweixin-1.0.0", [], function () { return b(a) }) }(this, function (a, b) {
    function c(b, c, d) { a.WeixinJSBridge ? (E.debug && alert("invoke method:" + b), WeixinJSBridge.invoke(b, e(c), function (a) { h(b, a, d) })) : k(b, d) } function d(b, c, d) { a.WeixinJSBridge ? WeixinJSBridge.on(b, function (a) { d && d.trigger && d.trigger(a), h(b, a, c) }) : d ? k(b, d) : k(b, c) } function e(a) {
        return a = a || {}, a.appId = E.appId, a.verifyAppId = E.appId, a.verifySignType = "sha1",
            a.verifyTimestamp = E.timestamp + "", a.verifyNonceStr = E.nonceStr, a.verifySignature = E.signature, a
    } function f(a) { return { timeStamp: a.timestamp + "", nonceStr: a.nonceStr, "package": a["package"], paySign: a.paySign, signType: a.signType || "SHA1" } } function g(a) {
        return a.postalCode = a.addressPostalCode, delete a.addressPostalCode, a.provinceName = a.proviceFirstStageName, delete a.proviceFirstStageName, a.cityName = a.addressCitySecondStageName, delete a.addressCitySecondStageName, a.countryName = a.addressCountiesThirdStageName,
            delete a.addressCountiesThirdStageName, a.detailInfo = a.addressDetailInfo, delete a.addressDetailInfo, a
    } function h(a, b, c) {
        "openEnterpriseChat" == a && (b.errCode = b.err_code), delete b.err_code, delete b.err_desc, delete b.err_detail; var d = b.errMsg; d || (d = b.err_msg, delete b.err_msg, d = i(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", E.debug && !c.isInnerInvoke && alert(JSON.stringify(b)); var e = d.indexOf(":"), f = d.substring(e + 1); switch (f) {
            case "ok": c.success && c.success(b); break;
            case "cancel": c.cancel && c.cancel(b); break; default: c.fail && c.fail(b)
        }c.complete && c.complete(b)
    } function i(a, b) {
        var c = a, d = s[c]; d && (c = d); var e = "ok"; if (b) {
            var f = b.indexOf(":"); e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail");
        } return b = c + ":" + e
    } function j(a) { if (a) { for (var b = 0, c = a.length; c > b; ++b) { var d = a[b], e = r[d]; e && (a[b] = e) } return a } } function k(a, b) { if (!(!E.debug || b && b.isInnerInvoke)) { var c = s[a]; c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "") } } function l(a) { if (!x && !E.debug) { new Image; D.appId = E.appId, D.initTime = C.initEndTime - C.initStartTime, D.preVerifyTime = C.preVerifyEndTime - C.preVerifyStartTime } } function m() { return (new Date).getTime() } function n(b) {
        y && (a.WeixinJSBridge ? b() : t.addEventListener && t.addEventListener("WeixinJSBridgeReady", b, !1));
    } function o() { H.invoke || (H.invoke = function (b, c, d) { a.WeixinJSBridge && (E.debug && alert("invoke method:" + b), WeixinJSBridge.invoke(b, e(c), d)) }, H.on = function (b, c) { a.WeixinJSBridge && (E.debug && alert("invoke method:" + b), WeixinJSBridge.on(b, c)) }) } function p(b) { if ("undefined" == typeof b) return b; for (var c = "", d = new Uint8Array(b), e = d.byteLength, f = 0; e > f; f++)c += String.fromCharCode(d[f]); return a.btoa(c) } function q(b) {
        if ("undefined" == typeof b) return b; for (var c = a.atob(b), d = c.length, e = new Uint8Array(d), f = 0; d > f; f++)e[f] = c.charCodeAt(f);
        return e.buffer
    } if (!a.jWeixin) {
        var r = {
            config: "preVerifyJSAPI", onMenuShareTimeline: "menu:share:timeline", onMenuShareAppMessage: "menu:share:appmessage", onMenuShareWechat: "menu:share:wechat", onMenuShareQQ: "menu:share:qq", onMenuShareWeibo: "menu:share:weiboApp", onMenuShareQZone: "menu:share:QZone", previewImage: "imagePreview", getLocation: "geoLocation", openProductSpecificView: "openProductViewWithPid", addCard: "batchAddCard", openCard: "batchViewCard", chooseWXPay: "getBrandWCPayRequest", openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
            startSearchBeacons: "startMonitoringBeacons", stopSearchBeacons: "stopMonitoringBeacons", onSearchBeacons: "onBeaconsInRange", consumeAndShareCard: "consumedShareCard", openAddress: "editAddress", getUserOpenID: "getUserOpenID", getBrandWCPayRequest: "getBrandWCPayRequest", notifyNativeEvent: "notifyNativeEvent"
        }, s = function () { var a = {}; for (var b in r) a[r[b]] = b; return a }(), t = a.document, u = t.title, v = navigator.userAgent.toLowerCase(), w = navigator.platform.toLowerCase(), x = (!(!w.match("mac") && !w.match("win")), -1 != v.indexOf("wxdebugger")), y = -1 != v.indexOf("wxwork"), z = -1 != v.indexOf("android"), A = -1 != v.indexOf("iphone") || -1 != v.indexOf("ipad"), B = function () {
            var a = v.match(/wxwork\/(\d+\.\d+\.\d+)/) || v.match(/wxwork\/(\d+\.\d+)/); return a ? a[1] : ""
        }(), C = { initStartTime: m(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0 }, D = { version: "1.0.0", appId: "", initTime: 0, preVerifyTime: 0, networkType: "", isPreVerifyOk: 1, systemType: A ? 1 : z ? 2 : -1, clientVersion: B, url: encodeURIComponent(location.href) }, E = {}, F = { _completes: [] }, G = { state: 0, data: {} }; n(function () { C.initEndTime = m() }); var H = {
            config: function (a) {
                E = a, k("config", a); var b = E.check === !1 ? !1 : !0; n(function () {
                    if (b) c(r.config, {
                        verifyJsApiList: j(E.jsApiList)
                    }, function () { F._complete = function (a) { C.preVerifyEndTime = m(), G.state = 1, G.data = a }, F.success = function (a) { D.isPreVerifyOk = 0 }, F.fail = function (a) { F._fail ? F._fail(a) : G.state = -1 }; var a = F._completes; return a.push(function () { l() }), F.complete = function (b) { for (var c = 0, d = a.length; d > c; ++c)a[c](); F._completes = [] }, F }()), C.preVerifyStartTime = m(); else { G.state = 1; for (var a = F._completes, d = 0, e = a.length; e > d; ++d)a[d](); F._completes = [] }
                }), E.beta && o()
            }, ready: function (a) {
                0 != G.state ? a() : (F._completes.push(a),
                    !y && E.debug && a())
            }, error: function (a) { -1 == G.state ? a(G.data) : F._fail = a }, checkJsApi: function (a) { var b = function (a) { var b = a.checkResult; for (var c in b) { var d = s[c]; d && (b[d] = b[c], delete b[c]) } return a }; c("checkJsApi", { jsApiList: j(a.jsApiList) }, function () { return a._complete = function (a) { if (z) { var c = a.checkResult; c && (a.checkResult = JSON.parse(c)) } a = b(a) }, a }()) }, onMenuShareTimeline: function (a) {
                d(r.onMenuShareTimeline, {
                    complete: function () {
                        c("shareTimeline", {
                            title: a.title || u, desc: a.title || u, img_url: a.imgUrl || "",
                            link: a.link || location.href, type: a.type || "link", data_url: a.dataUrl || ""
                        }, a)
                    }
                }, a)
            }, onMenuShareAppMessage: function (a) { d(r.onMenuShareAppMessage, { complete: function () { c("sendAppMessage", { title: a.title || u, desc: a.desc || "", link: a.link || location.href, img_url: a.imgUrl || "", type: a.type || "link", data_url: a.dataUrl || "" }, a) } }, a) }, onMenuShareWechat: function (a) {
                d(r.onMenuShareWechat, {
                    complete: function () {
                        c("shareWechat", {
                            title: a.title || u, desc: a.desc || "", link: a.link || location.href, img_url: a.imgUrl || "", type: a.type || "link",
                            data_url: a.dataUrl || ""
                        }, a)
                    }
                }, a)
            }, onMenuShareQQ: function (a) { d(r.onMenuShareQQ, { complete: function () { c("shareQQ", { title: a.title || u, desc: a.desc || "", img_url: a.imgUrl || "", link: a.link || location.href }, a) } }, a) }, onMenuShareWeibo: function (a) { d(r.onMenuShareWeibo, { complete: function () { c("shareWeiboApp", { title: a.title || u, desc: a.desc || "", img_url: a.imgUrl || "", link: a.link || location.href }, a) } }, a) }, onMenuShareQZone: function (a) {
                d(r.onMenuShareQZone, {
                    complete: function () {
                        c("shareQZone", {
                            title: a.title || u, desc: a.desc || "",
                            img_url: a.imgUrl || "", link: a.link || location.href
                        }, a)
                    }
                }, a)
            }, startRecord: function (a) { a = a || {}, c("startRecord", { duration: a.duration, sampleRate: a.sampleRate, numberOfChannels: a.numberOfChannels, encodeBitRate: a.encodeBitRate, format: a.format, frameSize: a.frameSize, audioSource: a.audioSource }, a) }, stopRecord: function (a) { c("stopRecord", {}, a) }, onVoiceRecordEnd: function (a) { d("onVoiceRecordEnd", a) }, playVoice: function (a) { c("playVoice", { localId: a.localId }, a) }, pauseVoice: function (a) {
                c("pauseVoice", {
                    localId: a.localId
                }, a)
            }, stopVoice: function (a) { c("stopVoice", { localId: a.localId }, a) }, onVoicePlayEnd: function (a) { d("onVoicePlayEnd", a) }, uploadVoice: function (a) { c("uploadVoice", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a) }, downloadVoice: function (a) { c("downloadVoice", { serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a) }, translateVoice: function (a) { c("translateVoice", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a) }, chooseImage: function (a) {
                c("chooseImage", {
                    scene: "1|2", count: a.count || 9, sizeType: a.sizeType || ["original", "compressed"], sourceType: a.sourceType || ["album", "camera"], quality: a.quality || .8
                }, function () { return a._complete = function (a) { if (z) { var b = a.localIds; b && (a.localIds = JSON.parse(b)) } }, a }())
            }, previewImage: function (a) { c(r.previewImage, { current: a.current, urls1: a.urls1, urls: a.urls, hidePreviewMenuList: a.hidePreviewMenuList }, a) }, uploadImage: function (a) { c("uploadImage", { localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a) }, downloadImage: function (a) {
                c("downloadImage", { serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1 }, a)
            }, getLocalImgData: function (a) { c("getLocalImgData", { localId: a.localId, success: a.success }, a) }, previewFile: function (a) { c("previewFile", { url: a.url, name: a.name, size: a.size, hidePreviewMenuList: a.hidePreviewMenuList }, a) }, getNetworkType: function (a) {
                var b = function (a) {
                    var b = a.errMsg; a.errMsg = "getNetworkType:ok"; var c = a.subtype; if (delete a.subtype, c) a.networkType = c; else {
                        var d = b.indexOf(":"), e = b.substring(d + 1); switch (e) {
                            case "wifi": case "edge": case "wwan": a.networkType = e; break; default: a.errMsg = "getNetworkType:fail"
                        }
                    } return a
                }; c("getNetworkType", {}, function () { return a._complete = function (a) { a = b(a) }, a }())
            }, openLocation: function (a) { c("openLocation", { latitude: a.latitude, longitude: a.longitude, name: a.name || "", address: a.address || "", scale: a.scale || 28, infoUrl: a.infoUrl || "" }, a) }, getLocation: function (a) { a = a || {}, c(r.getLocation, { type: a.type || "wgs84" }, function () { return a._complete = function (a) { delete a.type }, a }()) }, hideOptionMenu: function (a) {
                c("hideOptionMenu", {}, a)
            }, showOptionMenu: function (a) { c("showOptionMenu", {}, a) }, closeWindow: function (a) { a = a || {}, c("closeWindow", {}, a) }, hideMenuItems: function (a) { c("hideMenuItems", { menuList: a.menuList }, a) }, showMenuItems: function (a) { c("showMenuItems", { menuList: a.menuList }, a) }, hideAllNonBaseMenuItem: function (a) { c("hideAllNonBaseMenuItem", {}, a) }, showAllNonBaseMenuItem: function (a) { c("showAllNonBaseMenuItem", {}, a) }, scanQRCode: function (a) {
                a = a || {}, c("scanQRCode", {
                    needResult: a.needResult || 0, scanType: a.scanType || ["qrCode", "barCode"]
                }, function () { return a._complete = function (a) { if (A) { var b = a.resultStr; if (b) { var c = JSON.parse(b); a.resultStr = c && c.scan_code && c.scan_code.scan_result } } }, a }())
            }, openAddress: function (a) { c(r.openAddress, {}, function () { return a._complete = function (a) { a = g(a) }, a }()) }, openProductSpecificView: function (a) { c(r.openProductSpecificView, { pid: a.productId, view_type: a.viewType || 0, ext_info: a.extInfo }, a) }, addCard: function (a) {
                for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) {
                    var g = b[e], h = {
                        card_id: g.cardId, card_ext: g.cardExt
                    }; d.push(h)
                } c(r.addCard, { card_list: d }, function () { return a._complete = function (a) { var b = a.card_list; if (b) { b = JSON.parse(b); for (var c = 0, d = b.length; d > c; ++c) { var e = b[c]; e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ } a.cardList = b, delete a.card_list } }, a }())
            }, chooseCard: function (a) {
                c("chooseCard", {
                    app_id: E.appId, location_id: a.shopId || "", sign_type: a.signType || "SHA1", card_id: a.cardId || "", card_type: a.cardType || "", card_sign: a.cardSign, time_stamp: a.timestamp + "",
                    nonce_str: a.nonceStr
                }, function () { return a._complete = function (a) { a.cardList = a.choose_card_info, delete a.choose_card_info }, a }())
            }, openCard: function (a) { for (var b = a.cardList, d = [], e = 0, f = b.length; f > e; ++e) { var g = b[e], h = { card_id: g.cardId, code: g.code }; d.push(h) } c(r.openCard, { card_list: d }, a) }, consumeAndShareCard: function (a) { c(r.consumeAndShareCard, { consumedCardId: a.cardId, consumedCode: a.code }, a) }, chooseWXPay: function (a) { c(r.chooseWXPay, f(a), a) }, openEnterpriseRedPacket: function (a) {
                c(r.openEnterpriseRedPacket, f(a), a);
            }, startSearchBeacons: function (a) { c(r.startSearchBeacons, { ticket: a.ticket }, a) }, stopSearchBeacons: function (a) { c(r.stopSearchBeacons, {}, a) }, onSearchBeacons: function (a) { d(r.onSearchBeacons, a) }, openEnterpriseChat: function (a) { c("openEnterpriseChat", { useridlist: a.userIds, chatname: a.groupName, userIds: a.userIds, groupName: a.groupName }, a) }, getUserOpenID: function (a) { c("fetchWXOpenIdRequest", {}, a) }, getBrandWCPayRequest: function (a) {
                c("getBrandWCPayRequest", {
                    appId: a.appId, partnerId: a.partnerId, openId: a.openId, timeStamp: a.timeStamp,
                    nonceStr: a.nonceStr, "package": a["package"], signType: a.signType, paySign: a.paySign
                }, a)
            }, onHistoryBack: function (a) { d("onHistoryBack", { complete: function () { if ("function" == typeof a) try { var b = a(); if (b === !1 || 0 === b) return !1 } catch (d) { } return c("historyBack"), !1 } }) }, notifyNativeEvent: function (a) { c("notifyNativeEvent", { event: a.event, resultCode: a.resultCode, data: a.data }, a) }, openBluetoothAdapter: function (a) { c("openBluetoothAdapter", {}, a) }, closeBluetoothAdapter: function (a) { c("closeBluetoothAdapter", {}, a) }, getBluetoothAdapterState: function (a) {
                c("getBluetoothAdapterState", {}, a)
            }, onBluetoothAdapterStateChange: function (a) { d("onBluetoothAdapterStateChange", { complete: function (b) { "function" == typeof a && a(b) } }) }, startBluetoothDevicesDiscovery: function (a) { c("startBluetoothDevicesDiscovery", { services: a.services || [], allowDuplicatesKey: a.allowDuplicatesKey || !1, interval: a.interval || 0 }, a) }, stopBluetoothDevicesDiscovery: function (a) { c("stopBluetoothDevicesDiscovery", {}, a) }, getBluetoothDevices: function (a) {
                c("getBluetoothDevices", {}, {
                    success: function (b) {
                        if (b && b.devices) for (var c = 0; c < b.devices.length; c++)b.devices[c].advertisData = q(b.devices[c].advertisData), b.devices[c].serviceData = q(b.devices[c].serviceData); "function" == typeof a.success && a.success(b)
                    }, fail: a.fail, complete: a.complete
                })
            }, onBluetoothDeviceFound: function (a) { d("onBluetoothDeviceFound", { complete: function (b) { if (b && b.devices) for (var c = 0; c < b.devices.length; c++)b.devices[c].advertisData = q(b.devices[c].advertisData); "function" == typeof a && a(b ? b.devices : b) } }) }, getConnectedBluetoothDevices: function (a) {
                c("getConnectedBluetoothDevices", { services: a.services }, a)
            }, createBLEConnection: function (a) { c("createBLEConnection", { deviceId: a.deviceId }, a) }, closeBLEConnection: function (a) { c("closeBLEConnection", { deviceId: a.deviceId }, a) }, onBLEConnectionStateChange: function (a) { d("onBLEConnectionStateChange", { complete: function (b) { "function" == typeof a && a(b) } }) }, getBLEDeviceServices: function (a) { c("getBLEDeviceServices", { deviceId: a.deviceId }, a) }, readBLECharacteristicValue: function (a) {
                c("readBLECharacteristicValue", {
                    deviceId: a.deviceId,
                    serviceId: a.serviceId, characteristicId: a.characteristicId
                }, a)
            }, getBLEDeviceCharacteristics: function (a) { c("getBLEDeviceCharacteristics", { deviceId: a.deviceId, serviceId: a.serviceId }, a) }, writeBLECharacteristicValue: function (a) { "object" == typeof a && a.value && (a.value = p(a.value)), c("writeBLECharacteristicValue", { deviceId: a.deviceId, serviceId: a.serviceId, characteristicId: a.characteristicId, value: a.value }, a) }, notifyBLECharacteristicValueChange: function (a) {
                c("notifyBLECharacteristicValueChange", {
                    deviceId: a.deviceId,
                    serviceId: a.serviceId, characteristicId: a.characteristicId, state: a.state
                }, a)
            }, onBLECharacteristicValueChange: function (a) { d("onBLECharacteristicValueChange", { complete: function (b) { b && b.value && (b.value = q(b.value)), "function" == typeof a && a(b) } }) }, startBeaconDiscovery: function (a) { c("startBeaconDiscovery", { uuids: a.uuids }, a) }, stopBeaconDiscovery: function (a) { c("stopBeaconDiscovery", {}, a) }, getBeacons: function (a) { c("getBeacons", {}, a) }, onBeaconUpdate: function (a) {
                d("onBeaconUpdate", {
                    complete: function (b) {
                        "function" == typeof a && a(b);
                    }
                })
            }, onBeaconServiceChange: function (a) { d("onBeaconServiceChange", { complete: function (b) { "function" == typeof a && a(b) } }) }, startWifi: function (a) { c("startWifi", {}, a) }, stopWifi: function (a) { c("stopWifi", {}, a) }, connectWifi: function (a) { var b = { SSID: a.SSID, BSSID: a.BSSID }; a.hasOwnProperty("password") && (b.password = a.password), c("connectWifi", b, a) }, getWifiList: function (a) { c("getWifiList", {}, a) }, onGetWifiList: function (a) { d("onGetWifiList", { complete: function (b) { "function" == typeof a && a(b) } }) }, onWifiConnected: function (a) {
                d("onWifiConnected", { complete: function (b) { "function" == typeof a && a(b) } })
            }, getConnectedWifi: function (a) { c("getConnectedWifi", {}, a) }, setClipboardData: function (a) { c("setClipboardData", { data: a.data }, a) }, getClipboardData: function (a) { c("getClipboardData", {}, a) }, onNetworkStatusChange: function (a) { d("onNetworkStatusChange", { complete: function (b) { "function" == typeof a && a(b) } }) }, onLocationChange: function (a) { d("auto:location:report", { complete: function (b) { "function" == typeof a && a(b) } }) }, onUserCaptureScreen: function (a) {
                d("onUserCaptureScreen", { complete: function (b) { "function" == typeof a && a(b) } })
            }, startRecordVoiceBuffer: function (a) { c("startRecordVoiceBuffer", { maxDuration: a.maxDuration }, a) }, stopRecordVoiceBuffer: function (a) { c("stopRecordVoiceBuffer", {}, a) }, onRecordBufferReceived: function (a) { d("onRecordBufferReceived", { complete: function (b) { "function" == typeof a && a(b) } }) }
        }; return b && (a.wx = a.jWeixin = H), H
    }
}), function (a) {
    function b(a, b) { } a.encodeURIComponent; try {
        a.wwperf = {
            config: function (c) {
                function d() {
                    try {
                        a.WeixinJSBridge && "complete" === g.readyState && a.setTimeout(e, 0);
                    } catch (d) { return b(d, c) }
                } function e() {
                    try {
                        if (i) return; i = !0; var d = -1; f.navigation && null != f.navigation.redirectCount && (d = f.navigation.redirectCount); var e = -1; if ("function" == typeof f.getEntries) { var g = f.getEntries(); e = 0; for (var j = g.length - 1; j >= 0; j--)"resource" == g[j].entryType && (e += 1) } a.WeixinJSBridge.invoke("innerSaveWebPerformance", {
                            perf_data: JSON.stringify({
                                env: c, url: a.location.href, redirect_count: d, resource_count: e, dns_time: Math.max(0, h.domainLookupEnd - h.domainLookupStart), connect_time: Math.max(0, h.connectEnd - h.connectStart),
                                request_time: Math.max(0, h.responseEnd - h.requestStart), loading_time: Math.max(0, h.domLoading - h.navigationStart), interactive_time: Math.max(0, h.domInteractive - h.navigationStart), complete_time: Math.max(0, h.domComplete - h.navigationStart), log_time: Math.floor(+new Date / 1e3)
                            })
                        }, function () { })
                    } catch (k) { return b(k, c) }
                } var f = a.performance, g = a.document, h = f.timing, i = !1; try {
                    var j = a.navigator.userAgent.toLowerCase(); if (!j.match("wxwork")) return; a.WeixinJSBridge ? d() : g.addEventListener("WeixinJSBridgeReady", d, !1), "complete" === g.readyState ? d() : a.addEventListener("load", d, !1);
                } catch (k) { return b(k, c) }
            }
        }
    } catch (c) { return b(c) }
}(this);