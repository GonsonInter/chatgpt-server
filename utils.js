/**
 * 工具方法
 */
import xml2js from "xml2js";

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
};

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
    </xml>`;
};

/**
 * 根据接收到的消息回复，根据关键字来匹配，如果没有匹配上返回 undefined
 * @param {*} text 原消息
 * @returns 回复的消息
 */
export const replyTextMatchMessage = (text) => {
  const dadTxtArr = [
    "谁是王子杰",
    "王子杰是谁",
    "认识王子杰吗",
    "狗剩是谁",
    "认识狗剩吗",
    "gou sheng",
    "gousheng",
  ];

  if (new RegExp(dadTxtArr.join("|"), "i").test(text)) {
    return "是你爹。";
  }
};
