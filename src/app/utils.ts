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
            fetch(Constants.CORS_PROXY + Constants.BASE_URL + "baidu-api-access",
            {
                method: "POST",
                headers:
                {
                    "udid": info.udid,
                    "platform": info.platform,
                    "width": "" + info.width,
                    "height": "" + info.height
                }
            })
            .then(response =>
            {
                // Get response text
                // 获取回复的文字
                response.text().then(text =>
                {
                    // TODO: Remove debug output, better handle errors
                    alert(text);

                    // Store in database
                    // 存入数据库
                    storage.set("baidu-api-access", text.split(":")[1]);
                })
                .catch(alert);
            })
            .catch(alert);
        })
        .catch(alert);
    }
}
