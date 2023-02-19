/**
 * 常量
 */

/** 微信配置 */
export const WECHAT_CONFIG = {
  appId: "",
  appSecret: "",
  token: "",
};

/** redis 配置 */
export const REDIS_CONF = {
  port: 6379,
  host: "127.0.0.1",
};

/** redis 存储的微信用户 id 的前缀 */
export const WECHAT_USER_PFX = "wechat_user_id:";

/** redis 中消息的过期时间 */
export const MSG_EXPIRE_TIME = 60 * 60;

/** 微信客服消息调用接口 */
export const WECHAT_CGI_URL =
  "https://api.weixin.qq.com/cgi-bin/message/custom/send";
