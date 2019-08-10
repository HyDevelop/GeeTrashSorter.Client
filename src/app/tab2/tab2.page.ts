import {Component, ViewEncapsulation} from '@angular/core';
import {Storage} from '@ionic/storage';
import pWaitFor from 'p-wait-for';
import {ActionSheetController} from '@ionic/angular';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import {Constants} from '../constants';
import {Utils} from '../utils';

// TODO: Add splash
// TODO: Add some ng-Fx
// TODO: Share
// TODO: 加颜色
// TODO: Clickable links

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
     * This instance
     * 这个实例
     */
    public static instance: Tab2Page;

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
    public syncedSearchFocused: boolean;

    public constructor(
        private storage: Storage,
        private actionSheetController: ActionSheetController,
        private clipboard: Clipboard)
    {
        // Set instance
        // 赋值实例
        Tab2Page.instance = this;

        // Obtain search history
        // 获取搜索历史
        storage.get(Constants.STORAGE_HISTORY).then(value =>
        {
            // Initialize value if not already
            // 初始化数值
            if (value == null)
            {
                storage.set(Constants.STORAGE_HISTORY, value = ['猫', '芒果干', '湿纸巾', '电池']);
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
     * This method sets the content in the search bar.
     * 设置搜索框内容
     *
     * @param content Content
     */
    public setSearchContent(content: string)
    {
        this.syncedSearchText = content;
    }

    /**
     * This method is executed when user searches.
     * 用户搜索事件
     */
    public onSearchBarEnter()
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
        this.storage.set(Constants.STORAGE_HISTORY, this.syncedItemListArray);
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

        // Check if already loading
        // 检查是不是已经在加载了
        let existingLoading = document.getElementById("hy-loading-" + text);
        if (existingLoading != null) return;

        // Remove spaces before and after text
        // 移除前后空格
        text = text.trim();

        // Obtain target if not specified
        // 如果未指定目标, 获取目标对象
        if (target == null)
            target = document.getElementById('hy-history-item-' + text);

        // Show loading
        // 显示加载中
        let loading = Utils.toElement(CARD_LOADING.replace('%{subtitle}', text));
        target.parentNode.insertBefore(loading, target.nextSibling);

        /**
         * Finish loading and show the results
         * 加载完, 显示结果
         *
         * @param element Result element
         */
        function finishLoading(element)
        {
            // Remove loading from html view
            // 移除加载卡片
            loading.remove();

            // Insert result to html view
            // 添加结果到显示
            target.parentNode.insertBefore(element, target.nextSibling);
        }

        // Get location
        // 获取地区
        this.storage.get(Constants.STORAGE_LOCATION).then(location =>
        {
            // Send a GET request
            // 发送 GET 请求
            fetch(`${Constants.CORS_PROXY}${Constants.BASE_URL}${location}?name=${text}`, {method: "POST"})
            .then(respose =>
            {
                respose.text().then(responseText =>
                {
                    // Finish loading and process results
                    // 加载完, 处理然后显示结果
                    finishLoading(this.processHttpResponse(text, JSON.parse(responseText)));
                })
                .catch(err =>
                {
                    finishLoading(this.createCard(text, '发生错误', '网络连接异常 (读取异常)', null, 'hy-card-error'));
                    Utils.debug('Tab2Page.onClickHistory:err1', err);
                });
            })
            .catch(err =>
            {
                finishLoading(this.createCard(text, '发生错误', '网络连接异常', null, 'hy-card-error'))
                Utils.debug('Tab2Page.onClickHistory:err2', err);
            });
        })
        .catch(err =>
        {
            finishLoading(this.createCard(text, '发生错误', '未设置地区', null, 'hy-card-error'))
            Utils.debug('Tab2Page.onClickHistory:err3', err);
        });

    }

    /**
     * Process http api response
     * 处理 HTTP API 返回
     *
     * @param query What the user searched
     * @param data Returned data object
     * @returns Element to insert after target
     */
    private processHttpResponse(query: string, data)
    {
        // Some errors
        // 发生错误
        if (data.success == false)
        {
            // No data
            // 没有数据
            if (data.name.toLowerCase().includes('error: no data'))
                return this.createCard(query, '发生错误', '还没有收录它的数据', '可以尝试把这个垃圾分成更小的部分再搜索w', 'hy-card-error');

            // Other errors
            // 其他错误
            Utils.debug('Tab2Page.processHttpResponse:err1', JSON.stringify(data));
            return this.createCard(query, '发生错误', '未知错误, 请点击垃圾名重试', null, 'hy-card-error');
        }

        // Request success
        // 请求正常
        return this.createCard(query, data.name, data.type, data.steps, 'hy-card-success');
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
        let node = Utils.toElement(CARD_TEMPLATE
            .replace('%{query}', query)
            .replace('%{subtitle}', subtitle)
            .replace('%{title}', title)
            .replace('%{content-html}', content == null ? '' :
                CARD_CONTENT_TEMPLATE.replace('%{content}', content))
            .replace('%{class}', _class == null ? '' : _class)) as HTMLElement;

        // Add listener
        // 注册监听
        node.addEventListener('click', (event) => this.onCardClick(event));

        // Add content to attributes.
        // 添加内容到属性
        if (_class ==  'hy-card-success')
        {
            node.setAttribute("hy-subtitle", subtitle);
            node.setAttribute("hy-title", title);
            node.setAttribute("hy-content", content);
        }

        return node;
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
        // Find card element from the clicked element.
        // 从被点击的节点找到卡片节点
        let cardNode = event.target;
        for (let i = 0; i < 6; i++)
        {
            if (cardNode.classList.contains("hy-list-card")) break;
            cardNode = cardNode.parentNode;
        }
        if (!cardNode.classList.contains("hy-list-card")) cardNode = null;

        // Generate card click action sheet
        // 生成点击卡片的动作列表
        const actionSheet = await this.actionSheetController.create(
        {
            header: '操作',
            buttons: [
                {
                    text: '关闭卡片',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => cardNode.remove()
                },
                {
                    text: '复制卡片信息',
                    icon: 'copy',
                    handler: () =>
                    {
                        let content = cardNode.getAttribute("hy-subtitle") + "是" +
                                cardNode.getAttribute("hy-title") + "!\n" +
                                cardNode.getAttribute("hy-content");
                        this.clipboard.copy(content);
                    }
                },
                {
                    text: '取消',
                    icon: 'close',
                    role: 'cancel'
                }]
        });
        await actionSheet.present();
    }
}
