import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})

export class Tab2Page
{
    /**
     * Search bar element
     * 搜索框
     */
    private elementSearch;

    /**
     * Displaying item array for ngFor
     * 用 ngFor 显示的数组
     */
    private syncedItemListArray;

    /**
     * User input text for search (Live updating)
     * 用户搜索输入 (动态更新)
     */
    private syncedSearchText: any;

    constructor(private storage: Storage)
    {
        console.log("Tab2Page.constructor()");

        // Obtain search history
        // 获取搜索历史
        storage.get("history").then(value =>
        {
            // Initialize value if not alread
            // 初始化数值
            if (value == null) storage.set("history", value = []);

            // Assign result to the displaying array of ngFor
            // 赋值给 ngFor 显示的数组
            this.syncedItemListArray = value;
        });
    }

    /**
     * This method is called when the html finishes loading.
     * HTML 加载完成事件
     */
    ionViewDidEnter()
    {
        this.elementSearch = document.querySelector('#hy-search-bar');
    }

    /**
     * This method is executed when user searches.
     * 用户搜索事件
     *
     * @param event Search event
     */
    onSearchBarEnter(event)
    {
        console.log(event);
        console.log(this.elementSearch.text());
    }

    /**
     * This method is executed when user types
     * 用户输入事件
     *
     * @param $event
     */
    onSearchBarInput($event: CustomEvent<any>)
    {

    }
}
