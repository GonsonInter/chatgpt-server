/**
 * 工具方法
 */
import xml2js from 'xml2js'

/**
 * 解析 xml
 * @param {*} xml 
 * @returns 
 */
export const parseXMLAsync = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, content) => {
            if (err) {
                reject(err);
            }
            resolve(content);
        });
    });
}

/**
 * 格式化消息
 * @param {*} from 发送方
 * @param {*} to 接收方
 * @param {*} content 发送内容
 */
export const formatXMLString = (from, to, content) => {
    return `<xml>
        <ToUserName><![CDATA[${to}]]></ToUserName>
        <FromUserName><![CDATA[${from}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
    </xml>`
}