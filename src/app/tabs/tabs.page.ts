import {Component} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Constants} from '../constants';
import {Router} from '@angular/router';
import {Tab2Page} from '../tab2/tab2.page';
import pWaitFor from 'p-wait-for';

// TODO: Configurable camera options

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
                private camera: Camera)
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
        // Keep instance
        // 保留实例
        let instance = this;

        // Create options
        // 创建配置
        const options: CameraOptions =
        {
            quality: 100,
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
            alert(imageData);

            // Show loading
            // TODO: 显示加载界面
            instance.router.navigateByUrl("/tabs/tab2");

            // Add url prefix
            // 添加 URL 前缀
            let base64Image = 'data:image/jpeg;base64,' + imageData;

        },
        err =>
        {
            alert(err);

            // TODO: Properly handle error
        });
    }
}
