Page({
    data:{
        windowHeight:0
    },
    takePhoto() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath
                })
            }
        })
    },
    error(e) {
        console.log(e.detail)
    },
    onLoad:function(options){
        const systemInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight:systemInfo.windowHeight
        });
    }
})