import {Component} from '@angular/core';
import {TabsPage} from '../tabs/tabs.page';
import {Tab2Page} from '../tab2/tab2.page';

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

    /**
     * Navigate to a specific tab number
     * 转到一个页面
     *
     * @param num Tab number
     */
    toTab(num: number)
    {
        TabsPage.getInstance().router.navigateByUrl("/tabs/tab" + num);
    }
}
