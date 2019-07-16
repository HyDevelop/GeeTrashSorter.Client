import * as pWaitFor from 'p-wait-for';

/**
 * Constants
 * 全局变量
 */
export class Constants
{
    /**
     * API Base URL
     * API 基础链接
     */
    public static BASE_URL = 'http://trash.hydev.org:24019/';

    /**
     * Cross site proxy
     * 跨站脚本代理 TODO: 写自己的代理
     */
    public static CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    // Storage key constant
    // 数据库键名

    /**
     * Searched trash name history
     * 查询垃圾名历史
     */
    public static STORAGE_HISTORY = 'history';

    /**
     * Baidu image recognition api key information
     * 百度图像识别 API Key
     */
    public static BAIDU_API_KEY_SPLIT;

    /**
     * Ensure everything is initialized
     * 确保初始化完成
     */
    public static ensureInitialized(callback)
    {
        if (this.BAIDU_API_KEY_SPLIT == null)
        {
            // Get baidu image recognition api keys
            // 获取百度识图 API Key
            let request = new XMLHttpRequest();
            request.onreadystatechange = function()
            {
                // Process results
                // 处理结果
                if (request.readyState == 4)
                {
                    let split = request.responseText.split(";");

                    callback();
                }
                // TODO: Handle error
            };
            request.open('POST', Constants.CORS_PROXY + Constants.BASE_URL + "baidu-api-secret", true);
            request.send('');
        }
        else callback();
    }
}
