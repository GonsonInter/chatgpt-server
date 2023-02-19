/**
 * @author 王子杰
 * @description 微信验证相关方法
 */

import crypto from "crypto";
import fetch from "node-fetch";
import {
  WECHAT_CGI_URL,
  WECHAT_ACCESS_TOKEN,
  WECHAT_ACCESS_KEY_URL,
  WECHAT_TOKEN_EXPIRE,
} from "../constants.js";
import config from "../config.js";
import { redisGet, redisSet } from "../redis.js";

const { APP_ID, APP_SECRET } = config;

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
 * 获取微信的 access_token
 * 发送请求时需要带上
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
const getAccessToken = async () => {
  const existsToken = await redisGet(WECHAT_ACCESS_TOKEN);
  if (existsToken) return existsToken;

  const res = await fetch(
    `${WECHAT_ACCESS_KEY_URL}?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`
  );

  console.log(res);

  const { access_token, expires_in } = res;

  /** 缓存 微信 access_token */
  redisSet(WECHAT_ACCESS_TOKEN, access_token, expires_in);

  return access_token;
};

/**
 * 走微信客服向用户异步发送消息：
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Service_Center_messages.html
 */
const sendCgiMessage = async (toUserName, content) => {
  const body = {
    touser: toUserName,
    msgtype: "text",
    text: {
      content,
    },
  };

  const accessToken = await getAccessToken();

  return await fetch(`${WECHAT_CGI_URL}?access_token=${accessToken}`, {
    method: "POST",
    body,
  });
};

export { validateWechatSignature, sendCgiMessage };
