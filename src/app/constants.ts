import * as pWaitFor from 'p-wait-for';

/**
 * Constants
 * 全局变量
 */
export class Constants
{
    /**
     * Debug or not
     * 是否输出测试信息
     */
    public static DEBUG = true;

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

    /**
     * Minimum score for an image recognition result to count
     * 图像识别最小分数
     */
    public static IR_MIN_SCORE = 0.09;

    // Storage key constant
    // 数据库键名

    /**
     * Searched trash name history
     * 查询垃圾名历史
     */
    public static STORAGE_HISTORY = 'history';

    /**
     * Selected location
     * 选择的地区位置
     */
    public static STORAGE_LOCATION = 'location';
}
