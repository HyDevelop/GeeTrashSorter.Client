import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent
{
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    )
    {
        this.initializeApp();
    }

    /**
     * Called when the app initializes
     */
    initializeApp()
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
 * Constants
 * 全局变量
 */
export class Constants
{
}
