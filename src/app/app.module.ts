import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {AlertController, IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Camera} from '@ionic-native/camera/ngx';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        IonicStorageModule,
        Camera,
        Base64ToGallery,
        UniqueDeviceID,
        Keyboard,
        AlertController,
        ScreenOrientation
    ],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
