import { fetchSyncPost, IWebSocketData } from "siyuan";

// 发送请求并获得返回结果
export async function request(url: string, data: any) {
    let response: IWebSocketData = await fetchSyncPost(url, data);
    let res = response.code == 0 ? response.data : null;
    return res;
}

// 获取块karmdown源码
export async function getKramdown(id: string) {
    let data = { "id": id };
    return request("/api/block/getBlockKramdown", data);
}

// 更新块
export async function updateBlock(id: string, markdown: string) {
    let data = { "id": id, "data": markdown, "dataType": "markdown" }
    return request("/api/block/updateBlock", data);
}

// 弹出通知
export async function sendMessage(message: string, timeout?: number) {
    let data = { "msg": message, "timeout": timeout };
    return request("/api/notification/pushMsg", data);
}

// 弹出报错
export async function sendError(message: string, timeout?: number) {
    let data = { "msg": message, "timeout": timeout };
    return request("/api/notification/pushErrMsg", data);
}