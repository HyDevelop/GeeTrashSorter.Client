import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {Utils} from './utils';
import {Storage} from '@ionic/storage';
import {Constants} from './constants';
import * as pWaitFor from 'p-wait-for';
import * as $ from 'jquery'

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent
{
    /**
     * Keep the active instance
     * 活动实例
     */
    private static instance;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        private uniqueDeviceID: UniqueDeviceID
    )
    {
        AppComponent.instance = this;
        this.initApp();

        // Wait for page to load
        // 等待页面加载完
        pWaitFor(() => document.querySelector('#hy-loading') != null).then(() =>
        {
            pWaitFor(() => document.querySelector('ion-router-outlet') != null).then(() =>
            {
                this.showLoading(true);

                this.initStorage();
            });
        });
    }

    /**
     * Initialize storage
     * 初始化数据库
     */
    private initStorage()
    {
        // Check if storage is already initialized.
        // 检查是否已经初始化过了
        // TODO: Better error handling
        this.storageValid().then(valid =>
        {
            if (valid)
            {
                this.showLoading(false);
                return;
            }

            // Create variable
            // 创建变量
            let deviceInfo = new DeviceInfo();

            // Obtain device UDID if not found
            // 获取设备 UDID
            this.uniqueDeviceID.get().then(uuid =>
            {
                this.platform.ready().then(() =>
                {
                    // Store device platform information
                    // 保存设备系统信息
                    deviceInfo.udid = uuid;
                    deviceInfo.platform = this.platform.platforms().toString();
                    deviceInfo.width = this.platform.width();
                    deviceInfo.height = this.platform.height();

                    Utils.debug('AppComponent.initStorage:deviceInfo', JSON.stringify(deviceInfo));

                    // Store to storage
                    // 保存到数据库
                    this.storage.set("info", JSON.stringify(deviceInfo)).then(() =>
                    {
                        // Update Baidu api
                        // 初始化百度 API
                        this.updateBaiduApiKey();
                    })
                    .catch(err =>
                    {
                        Utils.debug('AppComponent.initStorage:err1', err);
                        this.initFailed('存储返回值失败,<br>可能是没有数据存储权限.', err);
                    });

                    // Store default values
                    this.storage.set(Constants.STORAGE_LOCATION, 'shanghai');
                })
                .catch(err =>
                {
                    Utils.debug('AppComponent.initStorage:err2', err);
                    this.initFailed('设备准备状态错误. (未知)', err);
                });
            })
            .catch(err =>
            {
                Utils.debug('AppComponent.initStorage:err3', err);
                this.initFailed('获取 UUID 失败,<br>可能是缺少权限.', err);
            });
        });
    }

    /**
     * Update baidu api access token
     * 更新百度 API 访问
     */
    public updateBaiduApiKey()
    {
        // Get device info
        // 获取设备信息
        this.storage.get("info").then(infoString =>
        {
            let info: DeviceInfo = JSON.parse(infoString);

            // Fetch http request
            // 获取请求
            fetch(Constants.CORS_PROXY + Constants.BASE_URL + "baidu-api-access", {method: "POST",
                headers: {"udid": info.udid, "platform": info.platform, "width": "" + info.width, "height": "" + info.height}})
            .then(response =>
            {
                // Get response text
                // 获取回复的文字
                response.text().then(text =>
                {
                    Utils.debug('Utils.updateBaiduApiKey():response', text);

                    // Validate response
                    // 判断是否正确
                    if (!text.startsWith('TokenRequestSuccess:'))
                    {
                        Utils.debug('Utils.updateBaiduApiKey():err:dataInvalid', text);
                        this.initFailed('获取访问码报错,<br>大概是网络问题,<br>重试一遍吧w!', text);
                        return;
                    }

                    // Store in database
                    // 存入数据库
                    this.storage.set("baidu-api-access", text.split(":")[1]);

                    // Success!
                    // 成功!
                    this.showLoading(false);
                })
                .catch(err =>
                {
                    Utils.debug('Utils.updateBaiduApiKey():err1', err);
                    this.initFailed('转码到文字失败. (未知)', err);
                });
            })
            .catch(err =>
            {
                Utils.debug('Utils.updateBaiduApiKey():err2', err);
                this.initFailed('获取访问码失败,<br>大概是网络问题或者没有更新.<br>(或者是我的服务器宕了)<br>;-;', err);
            });
        })
        .catch(err =>
        {
            Utils.debug('Utils.updateBaiduApiKey():err3', err);
            this.initFailed('读取存储失败.', err);
        });
    }

    /**
     * Show a failed loading screen
     * 加载失败
     *
     * @param message Error message
     * @param detail More detailed error message
     */
    private initFailed(message: string, detail?: string)
    {
        // Make loading screen red
        // 把加载页变红
        $('#hy-loading').css('background-color', '#b925257a');

        // Hide loading spinner
        // 隐藏加载圈
        $('#hy-loading ion-spinner').hide();

        // Create text
        // 创建文字
        let text = '初始化失败了 ;-;<br>请退出重试,<br>或者看看有没有更新什么的w<br>';
        if (message != null) text += `<br>错误原因: ${message}<br>`;
        if (detail != null) text += `<br><div style="font-size: 10px; color: lightcyan">详细报错原因: ${detail}</div>`

        // Change text
        // 改文字
        $('#hy-loading-text').html(text);
    }

    /**
     * Toggle the show state of the loading screen
     * 开/关加载界面
     *
     * @param shown Shown or not
     */
    private showLoading(shown: boolean)
    {
        if (shown)
        {
            $('#hy-loading').show();
            $('ion-router-outlet').css("filter", "blur(8px)");
        }
        else
        {
            $('#hy-loading').hide();
            $('ion-router-outlet').css("filter", "none");
        }
    }

    /**
     * Verify if storage is valid
     * 验证数据库是否完整
     */
    private storageValid()
    {
        return new Promise((resolve, reject) =>
        {
            // Obtain keys
            // 获取键组
            this.storage.keys().then(keys =>
            {
                // Check if all keys exists.
                // 检查是否所有键存在
                if (keys.indexOf("info") < 0) resolve(false);
                if (keys.indexOf("baidu-api-access") < 0) resolve(false);
                if (keys.indexOf(Constants.STORAGE_LOCATION) < 0) resolve(false);
                resolve(true);
            });
        });
    }

    /**
     * Called when the app initializes
     * 初始化应用
     */
    private initApp()
    {
        this.platform.ready().then(() =>
        {
            this.statusBar.styleDefault();

            // Fix black status bar
            if(this.platform.is('android'))
            {
                // set status bar to white
                this.statusBar.backgroundColorByHexString('#ffe5e6');
            }

            this.splashScreen.hide();
        });
    }

    /**
     * Obtain the active instance
     * 获取活动实例
     */
    public static getInstance()
    {
        return this.instance;
    }

    /**
     * Obtain the status bar control object
     * 获取状态栏控制对象
     */
    public getStatusBar()
    {
        return statusbar;
    }
}

/**
 * Device information
 * 设备信息类
 */
export class DeviceInfo
{
    constructor(public udid?: string,
                public platform?: string,
                public width?: number,
                public height?: number) {}
}
