import {Component} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Utils} from '../utils';
import {Constants} from '../constants';

// TODO: Configurable camera options

function debug(message)
{
    Utils.debug(message);
}

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage
{
    /**
     * Camera button element
     * 识图按钮节点
     */
    private elementCameraButton;

    /**
     * Current tab (Synced read, manual update)
     * 当前页面 (同步读取, 手动更新)
     */
    private syncedCurrentTab: string = "tab1";

    constructor(public router: Router,
                private camera: Camera,
                private storage: Storage)
    {
        // Constructs itself, good job!
    }

    /**
     * This method is called when a tab icon is clicked.
     * 标签页转向事件
     *
     * @param tab The tab that it changed to.
     */
    private onTabChange(tab: string)
    {
        this.syncedCurrentTab = tab;
    }

    /**
     * This method is called when the html finishes loading.
     * HTML 加载完成事件
     */
    private ionViewDidEnter()
    {
        this.elementCameraButton = document.querySelector('#hy-camera-button');
    }

    private getPicture()
    {
        this.storage.get("baidu-api-access").then(accessToken =>
        {
            // Keep instance
            // 保留实例
            let instance = this;

            // Create options
            // 创建配置
            const options: CameraOptions =
            {
                quality: 50,
                destinationType: this.camera.DestinationType.DATA_URL,
                sourceType: this.camera.PictureSourceType.CAMERA,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                cameraDirection: this.camera.Direction.BACK,
            };

            // Take picture
            // 拍照
            this.camera.getPicture(options).then(imageData =>
            {
                // Show loading
                // TODO: 显示加载界面
                instance.router.navigateByUrl("/tabs/tab2");

                // Image recognition
                // 图像识别
                let request =
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: Utils.toFormBody({'image': <string> imageData})
                };

                // Debug output
                // 输出调试信息
                Utils.debug('Tabs.getPicture:imageData', imageData);
                Utils.debug('Tabs.getPicture:request', JSON.stringify(request));
                Utils.debug('Tabs.getPicture:accessToken', accessToken);

                fetch("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + accessToken, request)
                .then(response =>
                {
                    // Get response text
                    // 获取回复的文字
                    response.text().then(text =>
                    {
                        // Parse result as object
                        // 反序列化结果
                        let resultJson = JSON.parse(text);
                    })
                    .catch(alert);
                })
                .catch(alert);
            },
            err =>
            {
                alert(err);

                // TODO: Properly handle error
            })
            .catch(alert);
        })
        .catch(alert);
    }
}
