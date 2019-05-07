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