import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})

export class Tab2Page
{
    private search;

    /**
     * Displaying item array for ngFor
     * 用 ngFor 显示的数组
     */
    public itemListArray = ['12', '3'];

    constructor(private storage: Storage)
    {
        console.log("Tab2Page.constructor()");

        // Obtain search history
        // 获取搜索历史
        storage.get("history").then(value =>
        {
            // Initialize value if not alread
            // 初始化数值
            if (value == null)
            {
                value = [];
                storage.set("history", value);
            }

            // Assign result to the displaying array of ngFor
            // 赋值给 ngFor 显示的数组
            this.itemListArray = value;
        });
    }

    /**
     * This method is called when the html finishes loading.
     * HTML 加载完成事件
     */
    ionViewDidEnter()
    {
        console.log("ionViewDidEnter()");

        this.search = document.querySelector('#hy-search-bar');

        // Add input listener to search bar
        // 给搜索栏添加输入监听器
        this.search.addEventListener('ionInput', handleInput);

        function handleInput(event)
        {
            console.log("HandleInput");

            const query = event.target.value.toLowerCase();
            requestAnimationFrame(() =>
            {
                /*
                items.forEach(item =>
                {
                    const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
                    item.style.display = shouldShow ? 'block' : 'none';
                });*/
            });
        }
    }
}
