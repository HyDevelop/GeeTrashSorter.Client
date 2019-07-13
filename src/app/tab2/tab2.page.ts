import {Component, ViewEncapsulation} from '@angular/core';
import {Storage} from '@ionic/storage';
import pWaitFor from 'p-wait-for';
import {ActionSheetController} from '@ionic/angular';

// TODO: Add splash
// TODO: Add some ng-Fx
// TODO: Blocks clicks before one result successfully loads.

// API Base URL
// API 基础链接 TODO: 添加北京
const BASE_URL = 'http://trash.hydev.org/shanghai?name=';

// Cross site proxy
// 跨站脚本代理 TODO: 写自己的代理
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Storage key constant
// 数据库键名
const STORAGE_HISTORY = 'history'; // 查询垃圾名历史

// Html template for cards
// 卡片模板
const CARD_TEMPLATE = '<ion-card id=\'hy-card-%{query}\' class=\'hy-list-card %{class}\'>' +
    '<ion-card-header><ion-card-subtitle>%{subtitle}</ion-card-subtitle>' +
    '<ion-card-title>%{title}</ion-card-title></ion-card-header>%{content-html}</ion-card>';

const CARD_CONTENT_TEMPLATE = '<ion-card-content>%{content}</ion-card-content>';

const CARD_LOADING = '<ion-card><ion-spinner name=\'crescent\' class=\'hy-card-spinner\' ' +
    'id=\'hy-loading-%{subtitle}\' color=\'primary\'></ion-spinner></ion-card>';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    encapsulation: ViewEncapsulation.None
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
    private syncedSearchText: string = '';

    /**
     * Is the search focused (Synced read, manual update)
     * 用户是否在搜索框上 (动态读取, 手动更新)
     */
    private syncedSearchFocused: boolean;

    public constructor(
        private storage: Storage,
        private actionSheetController: ActionSheetController)
    {
        // TODO: Remove debug array.
        storage.set(STORAGE_HISTORY, ['芒果干', '湿纸巾', '电池', '纸巾']);

        console.log('Tab2Page.constructor()');

        // Obtain search history
        // 获取搜索历史
        storage.get(STORAGE_HISTORY).then(value =>
        {
            // Initialize value if not already
            // 初始化数值
            if (value == null)
            {
                storage.set(STORAGE_HISTORY, value = []);
            }

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
     * This method is called when the user enters or leaves the search bar.
     * 用户点击/点出搜索框事件
     *
     * @param value Focused or not
     */
    private onSearchFocusChange(value: boolean)
    {
        this.syncedSearchFocused = value;
    }

    /**
     * This method is executed when user searches.
     * 用户搜索事件
     */
    private onSearchBarEnter()
    {
        // Obtain input text
        // 获取输入内容
        let query = this.syncedSearchText.toLowerCase();

        // Record
        // 记录
        this.recordQuery(query);

        // Wait for ngfor to update record in html view
        // 等 ngFor 更新
        pWaitFor(() => document.getElementById('hy-history-item-' + query) == null).then(() =>
        {
            // Search
            // 查询
            this.onClickHistory(query);
        });
    }

    /**
     * Record query to storage
     * 记录查询到数据库
     *
     * @param text Query text
     */
    private recordQuery(text: string)
    {
        // Already contains entry, remove it
        // 已经记录了的话移除掉
        if (this.syncedItemListArray.includes(text))
            this.syncedItemListArray.splice(this.syncedItemListArray.indexOf(text, 0), 1);

        // Record entry to the first place
        // 记录到最前面
        this.syncedItemListArray.unshift(text);

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
    private onClickHistory(text: string, target?)
    {
        // Check if already exists, remove if it is not success
        // 检查重复, 如果不是成功的话就移除
        let existing = document.getElementById('hy-card-' + text);
        if (existing != null)
        {
            if (existing.classList.contains('hy-card-success')) return;
            else existing.remove();
        }

        // Remove spaces before and after text
        // 移除前后空格
        text = text.trim();

        // Obtain target if not specified
        // 如果未指定目标, 获取目标对象
        if (target == null)
            target = document.getElementById('hy-history-item-' + text);

        // Show loading
        // 显示加载中
        let loading = Tab2Page.toElement(CARD_LOADING.replace('%{subtitle}', text));
        target.parentNode.insertBefore(loading, target.nextSibling);

        // Keep instance
        // 保留实例
        let instance = this;

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
                let element = instance.processHttpResponse(text, request);

                // Remove loading from html view
                // 移除加载卡片
                loading.remove();

                // Insert result to html view
                // 添加结果到显示
                target.parentNode.insertBefore(element, target.nextSibling);
            }
        };
        request.open('GET', CORS_PROXY + BASE_URL + text, true);
        request.send('');
    }

    /**
     * Process http api response
     * 处理 HTTP API 返回
     *
     * @param query What the user searched
     * @param request Http request
     * @returns Element to insert after target
     */
    private processHttpResponse(query: string, request: XMLHttpRequest)
    {
        // Some HTTP error code
        // HTTP 错误码
        if (request.status != 200)
            return this.createCard(query, '发生错误', '网络连接异常', null, 'hy-card-error');

        // No data
        // 没有数据
        if (request.responseText.toLowerCase().includes('error: no data'))
            return this.createCard(query, '发生错误', '还没有收录它的数据', '可以尝试把这个垃圾分成更小的部分再搜索w', 'hy-card-error');

        // Other errors
        // 其他错误 TODO: 自动重试
        if (request.responseText.includes('Error'))
        {
            console.log(request.responseText);
            return this.createCard(query, '发生错误', '未知错误, 请重试', null, 'hy-card-error');
        }

        // Request success
        // 请求正常
        let response = JSON.parse(request.responseText);
        return this.createCard(query, response.name, response.type, response.steps, 'hy-card-success');
    }

    /**
     * Create a card html element.
     * 创建一个卡片 HTML
     *
     * @param query What the user searched.
     * @param subtitle Subtitle
     * @param title Title (Below subtitle)
     * @param content Content (Nullable)
     * @param _class CSS Class (Nullable)
     * @returns Html element.
     */
    private createCard(query: string, subtitle: string, title: string, content?: string, _class?: string)
    {
        let node = Tab2Page.toElement(CARD_TEMPLATE
            .replace('%{query}', query)
            .replace('%{subtitle}', subtitle)
            .replace('%{title}', title)
            .replace('%{content-html}', content == null ? '' :
                CARD_CONTENT_TEMPLATE.replace('%{content}', content))
            .replace('%{class}', _class == null ? '' : _class));

        // Add listener
        // 注册监听
        node.addEventListener('click', (event) => this.onCardClick(event));

        return node;
    }

    /**
     * Create DOM element from html string
     * 从 HTML 字符串创建 DOM 节点
     *
     * @param htmlString Html string
     */
    private static toElement(htmlString)
    {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    /**
     * This method is executed when user types
     * 用户输入事件
     *
     * @param event Input event
     */
    private onSearchBarInput(event)
    {
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

    /**
     * This method is called when a card is clicked
     * 卡片点击事件
     *
     * @param event Card click event.
     */
    private async onCardClick(event)
    {
        // Generate card click action sheet
        // 生成点击卡片的动作列表
        const actionSheet = await this.actionSheetController.create(
        {
            header: 'Albums',
            buttons: [
            {
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () =>
                {
                    // Find card element from the clicked element.
                    // 从被点击的节点找到卡片节点
                    let node = event.target;
                    for (;;)
                    {
                        if (node.classList().contains("hy-list-card")) break;
                        if (!node.hasChildNodes()) break;
                    }

                    // Remove node
                    // 移除
                    node.remove();
                }
            }, {
                text: 'Share',
                icon: 'share',
                handler: () => {
                    console.log('Share clicked');
                }
            }, {
                text: 'Play (open modal)',
                icon: 'arrow-dropright-circle',
                handler: () => {
                    console.log('Play clicked');
                }
            }, {
                text: 'Favorite',
                icon: 'heart',
                handler: () => {
                    console.log('Favorite clicked');
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }
}
