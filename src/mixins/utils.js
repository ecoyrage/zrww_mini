import wepy from 'wepy'
import {Base64} from 'js-base64'
import md5 from 'js-md5'

export default class utils extends wepy.mixin {
    data = {
        windowHeight:'',
        randomKey:'',
        accessToken:'',
        domain:'',
        longitude:'',
        latitude:'',
        adCode:'',

    }
    methods = {
    }
     

    genObj(obj) {
        return Base64.encode(JSON.stringify(obj));
    }
    genSign(obj){
        let randomKey = this.randomKey;
        return md5(obj + randomKey)
    }
    getBascicInfo(){
      let self=this;
      let json2={};
      json2.loginInfo="小程序";
      json2.adCode=self.adCode;
      json2.mobileType=3;
      json2.mobileVersion= self.$parent.globalData.mobileVersion
      json2.latitude=self.latitude
      json2.longitude=self.longitude
      let obj2=self.genObj(json2);
      let sign2=self.genSign(obj2);
      wepy.request({
        url:  self.domain+'/ww/api/v1/user/basicInfo',
        method: 'post',
        data: {object:obj2,sign:sign2},
        header:{
          'JWT': 'true',
          'content-type':'application/json',
          'Authorization':'Bearer '+self.accessToken
        },
        success(res) {
          if(res.data.code==100){
              wx.setStorageSync('basicInfo',res.data.data);
              wepy.reLaunch({
                url:'/pages/index/index'
              })
          }
        }
      })
    }
    getAdCode() {
      let self = this;
      wx.getLocation({
        type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
        success(res) {
          let latitude = res.latitude,
            longitude = res.longitude
          self.$parent.globalData.latitude = latitude
          self.$parent.globalData.longitude = longitude
          wepy.request({
            url: 'http://api.map.baidu.com/geocoder/v2/?&location=' + latitude + ',' + longitude + '&output=json&ak=5vsXU7pSrrRWAX7c1odIcgD6fV89KasD',
            method: 'get',
            success: function (res) {
              let result = res.data.result,
                  addressComponent = result.addressComponent,
                  adcode = addressComponent.adcode,
                  district = addressComponent.district;
              self.$parent.globalData.adCode = adcode;
              self.$parent.globalData.district = district
              self.$apply();
            },
            error: function (res) {
              this.getAdCode(latitude, longitude);
            }
          });
        }
      })
    }
    getRealityNum(data) {
      let num = data/10000000000;
      //处理非数字
      if (isNaN(num)) { return num };

      //处理不需要转换的数字
      var str = '' + num;
      if (!/e/i.test(str)) { return num; };

      return (num).toFixed(18).replace(/\.?0+$/, "");
    }
    changeWorkDay(data) {
      let day = data.split(",");
      let str = ""
      if (day.length == 7) {
        return "周一 至 周日"
      } else {
        for (let i = 0; i < day.length; i++) {
          if (day[i] == 1) {
            str += "周一、"
          }
          if (day[i] == 2) {
            str += "周二、"
          }
          if (day[i] == 3) {
            str += "周三、"
          }
          if (day[i] == 4) {
            str += "周四、"
          }
          if (day[i] == 5) {
            str += "周五、"
          }
          if (day[i] == 6) {
            str += "周六、"
          }
          if (day[i] == 7) {
            str += "周日、"
          }
        }
      }
      return str.substring(0, str.length - 1)
    }

    isResting(day, time) {
      let days = day.split(",");
      let today = new Date().getDay();
      if (today == 0) {
        today = 7
      }
      if (days.indexOf(today + "") > -1) {
        let times = time.split(",")
        let array = new Array();
        for (let i = 0; i < times.length; i++) {
          let hour = times[i].split("~")
          let start = hour[0]
          let end = hour[1]
          array.push(this.time_range(start, end))
        }
        return !this.contains(array, true);

      } else {
        return true;
      }

    }

    time_range(beginTime, endTime) {
      var strb = beginTime.split(":");
      var stre = endTime.split(":");
      var b = new Date();
      var e = new Date();
      var n = new Date();
      b.setHours(strb[0]);
      b.setMinutes(strb[1]);
      e.setHours(stre[0]);
      e.setMinutes(stre[1]);
      if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
      } else {
        return false;
      }
    }

    contains(a, obj) {
      var i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    }
 

    onLoad(){
        let self=this;
        self.randomKey = wx.getStorageSync('randomKey');
        self.accessToken = wx.getStorageSync('accessToken');
        self.domain = self.$parent.globalData.domain;
        self.adCode = self.$parent.globalData.adCode;
        self.longitude = self.$parent.globalData.longitude;
        self.latitude = self.$parent.globalData.latitude;
        wepy.getSystemInfo({
            success: function (res) {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                self.windowHeight = calc
            }
        });
    }
 
 


 
}