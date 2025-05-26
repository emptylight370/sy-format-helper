import { fetchSyncPost, IWebSocketData, Lute } from "siyuan";

// 发送请求并获得返回结果
export async function request(url: string, data?: any) {
    let response: IWebSocketData = await fetchSyncPost(url, data);
    let res = response.code == 0 ? response.data : null;
    return res;
}

// 获取块karmdown源码
export async function getKramdown(id: string) {
    let data = { id: id };
    return request("/api/block/getBlockKramdown", data);
}

// 获取块DOM
export async function getDom(id: string) {
    let data = { id: id };
    return request("/api/block/getBlockDOM", data);
}

export async function getCurrentTime() {
    return request("/api/system/currentTime");
}

// 更新块
export async function updateBlock(id: string, markdown: string) {
    let data = { id: id, data: markdown, dataType: "markdown" };
    return request("/api/block/updateBlock", data);
}

// 通过事务更新块，可撤回，应该是只支持DOM
export async function updateBlockTransactions(nodeId: string, appId: string, original: string, updated: string) {
    let nowTime = await getCurrentTime();
    let data = [
        {
            doOperations: [
                {
                    action: "update",
                    id: nodeId,
                    data: updated,
                },
            ],
            undoOperations: [
                {
                    action: "update",
                    id: nodeId,
                    data: original,
                },
            ],
        },
    ];
    return request("/api/transactions", {
        session: appId,
        app: appId,
        reqId: nowTime,
        transactions: data,
    });
}

// 刷新数据库提交事务
export async function refreshSQL() {
    return request("/api/sqlite/flushTransaction");
}

// 弹出通知
export async function sendMessage(message: string, timeout?: number) {
    let data = { msg: message, timeout: timeout };
    return request("/api/notification/pushMsg", data);
}

// 弹出报错
export async function sendError(message: string, timeout?: number) {
    let data = { msg: message, timeout: timeout };
    return request("/api/notification/pushErrMsg", data);
}

// 获取到思源用于转换markdown和DOM的编辑器
const NewLute: () => Lute = (globalThis as any).Lute.New;

// 从DOM转MD
export async function DOM2MD(dom: string) {
    let lute = NewLute();
    return lute.BlockDOM2Md(dom);
}

// 从DOM转HTML
export async function DOM2HTML(dom: string) {
    let lute = NewLute();
    return lute.BlockDOM2HTML(dom);
}

// 从HTML转MD
export async function HTML2MD(html: string) {
    let lute = NewLute();
    return lute.HTML2Md(html);
}

// 从HTML转DOM
export async function HTML2DOM(html: string) {
    let lute = NewLute();
    return lute.HTML2BlockDOM(html);
}

// 从MD转DOM
export async function MD2DOM(markdown: string) {
    let lute = NewLute();
    return lute.Md2BlockDOM(markdown);
}

// 从MD转HTML
export async function MD2HTML(markdown: string) {
    let lute = NewLute();
    return lute.BlockDOM2HTML(lute.Md2BlockDOM(markdown));
}