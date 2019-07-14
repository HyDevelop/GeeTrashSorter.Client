import {Component} from '@angular/core';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';

@Component({
    selector: 'app-tab4',
    templateUrl: 'tab4.page.html',
    styleUrls: ['tab4.page.scss']
})
export class Tab4Page
{
    constructor(private base64ToGallery: Base64ToGallery)
    {

    }
}
