
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

}
