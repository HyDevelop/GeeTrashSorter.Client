import {Component} from '@angular/core';
import {TabsPage} from '../tabs/tabs.page';

// TODO: Implement 提出意见

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page
{
    constructor()
    {

    }

    irClick()
    {
        TabsPage.getInstance().getPicture();
    }
}
