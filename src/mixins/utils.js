import wepy from 'wepy'
import {Base64} from 'js-base64'
import md5 from 'js-md5'

export default class utils extends wepy.mixin {
    data = {
        windowHeight:'',
        categoryList: [],
        randomKey:'',
        accessToken:'',
        domain:'',

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
        self.randomKey = self.$parent.globalData.randomKey;
        self.accessToken = self.$parent.globalData.accessToken;
        self.domain = self.$parent.globalData.domain;
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