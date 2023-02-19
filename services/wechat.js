/**
 * @author 王子杰
 * @description 微信验证相关方法
 */

import crypto from "crypto";
import fetch from "node-fetch";
import { WECHAT_CGI_URL } from "../constants.js";
import { WECHAT_TOKEN } from "../config.js";

/** SHA1 加密方法 */
const shasum = crypto.createHash("sha1");

/**
 * 官方文档 https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 * 1）将token、timestamp、nonce三个参数进行字典序排序
 * 2）将三个参数字符串拼接成一个字符串进行sha1加密
 * 3）开发者获得加密后的字符串可与 signature 对比，标识该请求来源于微信
 */
const validateWechatSignature = async (token, timestamp, nonce, signature) => {
  return signature === shasum.update([token, timestamp, nonce].sort().join(""));
};

/**
 * 走微信客服像用户异步发送消息：
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html
 */
const sendCgiMessage = async (toUserName, content) => {
  return await fetch(`${WECHAT_CGI_URL}?access_token=${WECHAT_TOKEN}`, {
    method: "POST",
    body: {
      touser: toUserName,
      msgtype: "text",
      text: {
        content,
      },
    },
  });
};

export { validateWechatSignature, sendCgiMessage };
