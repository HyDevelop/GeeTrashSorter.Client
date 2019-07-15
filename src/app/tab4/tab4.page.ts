import {Component} from '@angular/core';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';
import image2base64 from 'image-to-base64';
import {ActionSheetController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-tab4',
    templateUrl: 'tab4.page.html',
    styleUrls: ['tab4.page.scss']
})
export class Tab4Page
{
    constructor(private base64ToGallery: Base64ToGallery,
                private actionSheetController: ActionSheetController,
                private toastController: ToastController)
    {

    }

    /**
     * This method is called when the user clicks an image
     * 图片点击事件
     *
     * @param event Image click event
     */
    private async onImageClick(event)
    {
        // Generate card click action sheet
        // 生成点击卡片的动作列表
        const actionSheet = await this.actionSheetController.create(
        {
            header: '二维码',
            buttons: [
                {
                    text: '保存二维码w',
                    icon: 'save',
                    handler: () =>
                    {
                        image2base64(event.target.getAttribute("src")).then(base64 =>
                        {
                            this.base64ToGallery.base64ToGallery(base64).then(result =>
                            {
                                this.showToast("保存成功了!")
                            });
                        }).catch(error =>
                        {
                            // TODO: Remove debug error handling
                            alert(error);
                        });
                    }
                },
                {
                    text: '什么都不做w',
                    icon: 'close',
                    role: 'cancel'
                }]
        });
        await actionSheet.present();
    }

    private async showToast(message)
    {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000
        });
        toast.present();
    }
}
