import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {RequestOptionsArgs} from '@angular/http';

// API Base URL
// API 基础链接 TODO: 添加北京
const BASE_URL = "http://trash.hydev.org/shanghai?name=";

// Cross site proxy
// 跨站脚本代理 TODO: 写自己的代理
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

// Storage key constant
// 数据库键名
const STORAGE_HISTORY = "history"; // 查询垃圾名历史

// Html template for cards
// 卡片模板
const CARD_TEMPLATE = "<ion-card><ion-card-header><ion-card-subtitle>%{subtitle}</ion-card-subtitle>" +
    "<ion-card-title>%{title}</ion-card-title></ion-card-header>%{content-html}</ion-card>";
const CARD_CONTENT_TEMPLATE = "<ion-card-content>%{content}</ion-card-content>";

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

    public constructor(private storage: Storage)
    {
        // TODO: Remove debug array.
        storage.set(STORAGE_HISTORY, ["芒果干", "苹果", "垃圾袋", "纸巾"]);

        console.log("Tab2Page.constructor()");

        // Obtain search history
        // 获取搜索历史
        storage.get(STORAGE_HISTORY).then(value =>
        {
            // Initialize value if not alread
            // 初始化数值
            if (value == null) storage.set(STORAGE_HISTORY, value = []);

            // Assign result to the displaying array of ngFor
            // 赋值给 ngFor 显示的数组
            this.syncedItemListArray = value;
        });
    }

    /**
     * This method is called when the html finishes loading.
     * HTML 加载完成事件
     */
    private ionViewDidEnter()
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
    private onSearchBarEnter(event)
    {
        console.log(event);

        // Obtain input text
        // 获取输入内容
        let query = event.target.value.toLowerCase();

        //

    }

    /**
     * Record query to storage
     * 记录查询到数据库
     *
     * @param text Query text
     */
    private recordQuery(text: String)
    {
        // Already contains entry
        // 已经记录了
        if (this.syncedItemListArray.contains(text)) return;

        // Record entry
        // 记录
        this.syncedItemListArray.add(text);

        // Sync to storage
        // 同步到数据库
        this.storage.set(STORAGE_HISTORY, this.syncedItemListArray);
    }

    /**
     * This method is called when the user clicks an item in query history.
     * 点击历史记录项
     *
     * @param text Clicked entry
     * @param target Target to add the result below
     */
    private onClickHistory(text: String, target)
    {
        // Send a GET request
        // 发送 GET 请求
        let request = new XMLHttpRequest();
        request.onreadystatechange = function()
        {
            // Process results
            // 处理结果
            if (request.readyState == 4)
            {
                // Obtain element
                // 获取对象
                let element = Tab2Page.processHttpResponse(request);

                // Insert it to html view
                // 添加到显示 TODO: Test this
                target.parentNode.insertBefore(element, target.nextSibling())
            }
        };
        request.open("GET", CORS_PROXY + BASE_URL + text, true);
        request.send("");
    }

    /**
     * Process http api response
     * 处理 HTTP API 返回
     *
     * @param request Http request
     * @returns Element to insert after target
     */
    private static processHttpResponse(request: XMLHttpRequest)
    {
        // Some HTTP error code
        // HTTP 错误码
        if (request.status != 200)
        {

            return
        }

        console.log(request.responseText);



        if (request.responseText === "Error: no data")
        {

        }

        let html = "\n" +
            "        <ion-card>\n" +
            "            <ion-card-header>\n" +
            "                <ion-card-subtitle>${}</ion-card-subtitle>\n" +
            "                <ion-card-title>${}</ion-card-title>\n" +
            "            </ion-card-header>\n" +
            "\n" +
            "            <ion-card-content>\n" +
            "                Keep close to Nature's heart... and break clear away, once in awhile,\n" +
            "                and climb a mountain or spend a week in the woods. Wash your spirit clean.\n" +
            "            </ion-card-content>\n" +
            "        </ion-card>"
    }

    /**
     * This method is executed when user types
     * 用户输入事件
     *
     * @param event Input event
     */
    private onSearchBarInput(event)
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
