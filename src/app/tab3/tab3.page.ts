import {Component, ViewEncapsulation} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Constants} from '../constants';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Tab3Page
{
    /**
     * Selected location
     * 选择的位置
     */
    private locationSelected: string;

    /**
     * Selected theme
     * 选择的主题
     */
    private themeSelected: string;

    constructor(private storage: Storage,
                private toastController: ToastController)
    {
        // Set variables according to storage.
        storage.get(Constants.STORAGE_LOCATION).then(location =>
        {
            this.locationSelected = location;
        })
        .catch(alert);
    }

    /**
     * Called when the selected location changes
     * 选择的位置变化
     *
     * @param event IonChange event
     */
    private onLocationChange(event)
    {
        this.storage.set(Constants.STORAGE_LOCATION, this.locationSelected).then(() =>
        {
            this.toastSaveSuccess();
        });
    }

    /**
     * Present a toast saying something like "Settings saved"
     * 保存成功提示
     */
    async toastSaveSuccess()
    {
        const toast = await this.toastController.create({
            cssClass: 'hy-toast',
            message: '保存成功! (๑>◡<๑)',
            duration: 2000000
        });
        await toast.present();
    }

    /**
     * Called when the selected theme changes
     * 选择的主题变化
     *
     * @param event IonChange event
     */
    private onThemeChange(event)
    {
        this.toastSaveSuccess()
    }
}
