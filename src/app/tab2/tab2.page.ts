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
     * Search history item list element
     * 历史记录列表
     */
    private elementItemList;

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
        // TODO: Remove debug array.
        storage.set("history", ["芒果干", "苹果", "垃圾袋", "纸巾"]);

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
        this.elementItemList = document.querySelector('#hy-item-list');
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
     * @param event Input event
     */
    onSearchBarInput(event)
    {
        console.log("HandleInput");

        // Obtain input text
        // 获取输入内容
        let query = event.target.value.toLowerCase();

        // Obtain displaying entries
        // 获取显示的列表
        let items = Array.from(document.querySelector('ion-list').children as HTMLCollectionOf<HTMLElement>);

        // Update relevant history item list
        // 更新历史记录列表
        requestAnimationFrame(() =>
        {
            items.forEach(item =>
            {
                // Check if contains the user input
                // 验证是否包含用户输入
                let shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;

                // Update list
                // 更新列表
                item.style.display = shouldShow ? 'block' : 'none';
            });
        });
    }
}
