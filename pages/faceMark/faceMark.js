const app = getApp()
// console.log(app.globalDada);
Page({
    data:{
        windowHeight:0,
        // 摄像头朝向
        position:"back",
        // 照片的路径
        src: '',
        // 是否展示选择的照片
        isShowPic: false,
        isShowBox: false,
        // 人脸信息
        faceInfo: null,
        map: {
            gender: {
                male: '男',
                female: '女'
            },
            expression: {
                none: '平静', smile: '微笑', laugh: '大笑'
            },
            glasses: {
                none: '无眼镜', common: '普通眼镜', sun: '墨镜'
            },
            emotion: {
                angry: '愤怒', disgust: '厌恶', fear: '恐惧', happy: '高兴',
                sad: '伤心', surprise: '惊讶', neutral: '无情绪'
            }
        }
    },
    // 点击按钮，切换摄像头
    reverseCamera() {
        const newPosition = this.data.position === 'back' ? 'backfront' : 'back'
        this.setData({
            position: newPosition
        })
    },
    // 拍照
    takePhoto() {
        // 创建相机的实例对象
        const ctx = wx.createCameraContext()
        // ctx.takePhoto 实现拍照
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                console.log(res.tempImagePath)
                this.setData({
                    src: res.tempImagePath,
                    isShowPic: true
                }, () => {
                    this.getFaceInfo()
                })
            },
            fail: () => {
                console.log('拍照失败！')
                this.setData({
                    src: ''
                })
            }
        })
        console.log(this.data.src);
    },
    choosePhoto(){
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album'],
            success: (res) => {
                if (res.tempFilePaths.length > 0) {
                    this.setData({
                        src: res.tempFilePaths[0],
                        isShowPic: true
                    }, () => {
                        this.getFaceInfo()
                    })
                }
                console.log(this.data.src)

            },
            fail: () => {
                console.log('选择照片失败！')
                this.setData({
                    src: ''
                })
            }
        })
    },
    reChoose(){
        this.setData({
            isShowPic: false,
            src: '',
            isShowBox: false
        })
    },
    getFaceInfo() {
        const token = app.globalData.access_token
        // console.log(token)
        if (!token) {
            return wx.showToast({
                title: '鉴权失败！',
            })
        }
        wx.showLoading({
            title: '颜值检测中...',
        })
        const fileManager = wx.getFileSystemManager()
        const fileStr = fileManager.readFileSync(this.data.src, 'base64')
        // console.log(fileStr);
        wx.request({
            method: 'POST',
            url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + token,
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                image_type: 'BASE64',
                image: fileStr,
                // 年龄,颜值分数,表情,性别,是否戴眼镜,情绪
                face_field: 'age,beauty,expression,gender,glasses,emotion'
            },
            success: (res) => {
                console.log(res)
                if (res.data.result.face_num <= 0) {
                    return wx.showToast({
                        title: '未检测到人脸！',
                    })
                }

                this.setData({
                    faceInfo: res.data.result.face_list[0],
                    isShowBox: true
                })
            },
            fail: () => {
                wx.showToast({
                    title: '颜值检测失败！',
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    onLoad:function(options){
        const systemInfo = wx.getSystemInfoSync();
        this.setData({
            windowHeight:systemInfo.windowHeight
        });
    }
})