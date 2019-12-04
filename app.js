//app.js
App({
    globalData: {
        access_token:''
    },
    onLaunch: function() {
        this.globalData.access_token='aaa'
        wx.request({
            method:'post',
            url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=vnKtFP0LDOFkAiQzN6r8io9o&client_secret=Dv6rxOQh56uRSu3HSK3TAGRoSt9cSPHZ',
            success:(res)=>{
                this.globalData.access_token = res.data.access_token;
                console.log(this.globalData.access_token)
            },
            fail:()=>{
                console.log("失败了")
            }
        })
    }
})