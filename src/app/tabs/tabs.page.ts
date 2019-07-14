import {Component} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

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

    constructor(private camera: Camera)
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

        this.camera.getPicture(options).then
        (
            (imageData) =>
            {
                console.log(imageData);
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                let base64Image = 'data:image/jpeg;base64,' + imageData;
            },
            (err) =>
            {
                console.log(err);
                // TODO: Properly handle error
            }
        );
    }
}
