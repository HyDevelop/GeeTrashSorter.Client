import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {Utils} from './utils';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent
{
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        private uniqueDeviceID: UniqueDeviceID
    )
    {
        this.initStorage();
        this.initApp();
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
            if (valid) return;

            // Create variable
            // 创建变量
            let deviceInfo = new DeviceInfo();

            // Obtain device UDID if not found
            // 获取设备 UDID
            this.uniqueDeviceID.get().then(uuid =>
            {
                alert(uuid);
                deviceInfo.udid = uuid;
            })
            .catch(err => console.log(err));

            this.platform.ready().then(() =>
            {
                // Store device platform
                // 保存设备系统
                deviceInfo.platform = this.platform.platforms().toString();

                // Store device width and height
                // 保存设备长宽
                deviceInfo.width = this.platform.width();
                deviceInfo.height = this.platform.height();
            });

            // Store to storage
            // 保存到数据库
            this.storage.set("info", deviceInfo);

            // Update Baidu api
            // 初始化百度 API
            Utils.updateBaiduApiKey(this.storage);
        });
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
