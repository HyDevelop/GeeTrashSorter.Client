import {Constants} from './constants';
import {Storage} from '@ionic/storage';
import {DeviceInfo} from './app.component';

/**
 * Utility class
 * 工具类
 */
export class Utils
{
    /**
     * Create DOM element from html string
     * 从 HTML 字符串创建 DOM 节点
     *
     * @param htmlString Html string
     */
    public static toElement(htmlString)
    {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    /**
     * Update baidu api access token
     * 更新百度 API 访问
     *
     * @param storage 存储
     */
    public static updateBaiduApiKey(storage: Storage)
    {
        // Get device info
        // 获取设备信息
        storage.get("info").then(infoString =>
        {
            let info: DeviceInfo = JSON.parse(infoString);

            // Fetch http request
            // 获取请求
            fetch(Constants.CORS_PROXY + Constants.BASE_URL + "baidu-api-access", {method: "POST",
                headers: {"udid": info.udid, "platform": info.platform, "width": "" + info.width, "height": "" + info.height}})
            .then(response =>
            {
                // Get response text
                // 获取回复的文字
                response.text().then(text =>
                {
                    Utils.debug('Utils.updateBaiduApiKey():response', text);

                    // Validate response
                    // 判断是否正确
                    if (!text.startsWith('TokenRequestSuccess:'))
                    {
                        Utils.debug('Utils.updateBaiduApiKey():err:dataInvalid', text);
                        return;
                    }

                    // Store in database
                    // 存入数据库
                    storage.set("baidu-api-access", text.split(":")[1]);
                })
                .catch(err => Utils.debug('Utils.updateBaiduApiKey():err1', err)); // Todo: Show errors to user
            })
            .catch(err => Utils.debug('Utils.updateBaiduApiKey():err2', err));
        })
        .catch(err => Utils.debug('Utils.updateBaiduApiKey():err3', err));
    }

    /**
     * Generate form body string from class.
     * 从信息类生成表单 body 字符串.
     *
     * 用法:
     *   toFormBody({'testKey': 'testData'})
     *
     * @param details Informational class.
     */
    public static toFormBody(details)
    {
        let formBody = [];
        for (let property in details)
        {
            formBody.push(encodeURIComponent(property) + "=" + encodeURIComponent(details[property]));
        }
        return formBody.join("&");
    }

    /**
     * Log a debug message
     * 输出调试日志
     *
     * @param texts Messages
     */
    public static debug(...texts: string[])
    {
        if (Constants.DEBUG)
        {
            // Construct message
            // 组合信息
            let message = '';
            for (let text of texts) message += `${text}\n`;
            alert(message);
        }
    }

    /**
     * Parse baidu image recognition api data as keyword name array
     * 反序列化百度识图结果为关键词数组
     *
     * @param response Baidu IR api response text
     * @return string[] Keyword name array
     */
    public static parseBaiduIRApiData(response: string)
    {
        // Parse result as object
        // 反序列化结果
        let resultJson = JSON.parse(response);
        let results = [];

        // Parse json object as keyword name array
        // 把 JSON 结果转成关键词数组
        for (let i = 0; i < resultJson.result_num; i++)
        {
            let resultEntry = resultJson.result[i];
            if (resultEntry.score > Constants.IR_MIN_SCORE)
            {
                results.push(resultEntry.keyword);
            }
        }

        return results;
    }
}
