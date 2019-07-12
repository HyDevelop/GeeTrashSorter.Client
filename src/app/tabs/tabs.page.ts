import {Component} from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage
{
    constructor()
    {
    }

    /**
     * Called when a tab icon is clicked.
     *
     * @param $event The tab change event.
     */
    tabChanged($event: {tab: string })
    {

    }
}
