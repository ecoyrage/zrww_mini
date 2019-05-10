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
                url:'/pages/index'
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
                adcode = addressComponent.adcode
              self.$parent.globalData.adCode = adcode;
              self.$apply();
            },
            error: function (res) {
              this.getAdCode(latitude, longitude);
            }
          });
        }
      })
    }
    getFullNum(num) {
      //处理非数字
      if (isNaN(num)) { return num };

      //处理不需要转换的数字
      var str = '' + num;
      if (!/e/i.test(str)) { return num; };

      return (num).toFixed(18).replace(/\.?0+$/, "");
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