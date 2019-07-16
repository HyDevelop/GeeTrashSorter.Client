import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {Utils} from './utils';

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
        if (this.storage.getItem("info-udid") == null)
        {
            // Obtain device UDID if not found
            // 获取设备 UDID
            this.uniqueDeviceID.get().then(uuid =>
            {
                console.log(uuid);
                this.storage.setItem("info-udid", uuid);
            })
            .catch(err => console.log(err));

            this.platform.ready().then(() =>
            {
                // Store device platform
                // 保存设备系统
                this.storage.setItem("info-platform", this.platform.platforms().toString());

            });

            // Update Baidu api
            // 初始化百度 API
            Utils.updateBaiduApiKey(this.storage)
        }
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
