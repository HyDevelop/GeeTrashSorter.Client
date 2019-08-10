import {Component} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Utils} from '../utils';
import {Constants} from '../constants';
import {ActionSheetController} from '@ionic/angular';
import {Tab2Page} from '../tab2/tab2.page';

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

    /**
     * Active instance
     * 活动实例
     */
    private static instance: TabsPage;

    constructor(public router: Router,
                private camera: Camera,
                private storage: Storage,
                private actionSheetController: ActionSheetController)
    {
        TabsPage.instance = this;
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

    public getPicture()
    {
        this.storage.get("baidu-api-access").then(accessToken =>
        {
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
                this.router.navigateByUrl("/tabs/tab2");

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

                // Fetch request
                // 发送请求
                fetch("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + accessToken, request)
                .then(response =>
                {
                    // Get response text
                    // 获取回复的文字
                    response.text().then(text =>
                    {
                        let keywords = Utils.parseBaiduIRApiData(text);

                        // Debug output
                        // 输出调试信息
                        Utils.debug('Tabs.getPicture:response', text);
                        Utils.debug('Tabs.getPicture:keywords', JSON.stringify(keywords));

                        // Show search entry selection menu
                        // 显示选择搜索垃圾项菜单
                        this.showIRActionSheet(keywords);
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

    /**
     * Show action sheet to select image recognition result
     * 显示选择搜索垃圾项菜单
     *
     * TODO: multi selection
     *
     * @param keywords List of keywords
     */
    private async showIRActionSheet(keywords)
    {
        // Create buttons array from keywords
        // 创建按钮列表
        let buttons = [];
        for (let keyword of keywords)
        {
            buttons.push(
            {
                text: keyword,
                handler: () =>
                {
                    // Search entry on click
                    // 点击按钮时搜索
                    Tab2Page.instance.setSearchContent(keyword);
                    Tab2Page.instance.onSearchBarEnter();
                }
            });
        }

        // Generate card click action sheet
        // 生成点击卡片的动作列表
        const actionSheet = await this.actionSheetController.create(
        {
            header: '照片上识别出了这些物品, 要查哪个呢w?',
            buttons: buttons
        });
        await actionSheet.present();
    }

    /**
     * Get active instance
     * 获取活动实例
     */
    public static getInstance()
    {
        return TabsPage.instance;
    }

    /**
     * Is tab2page search bar active
     * 用户是否在使用第二页的搜索栏
     */
    private isSearchActive()
    {
        if (Tab2Page.instance == null) return false;
        return Tab2Page.instance.syncedSearchFocused;
    }

    /**
     * Search
     * 搜索
     */
    private search()
    {
        Tab2Page.instance.onSearchBarEnter();
    }
}
