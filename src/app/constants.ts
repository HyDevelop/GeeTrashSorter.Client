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
}
