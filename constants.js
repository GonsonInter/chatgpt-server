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

/** redis 存储 微信 access_token 的 key */
export const WECHAT_ACCESS_TOKEN = "wechat_access_token_key";

/** redis 中消息的过期时间 */
export const MSG_EXPIRE_TIME = 60 * 60;

/** 微信 access_token 的失效时间（两小时），为了保险，少设置一分钟 */
export const WECHAT_TOKEN_EXPIRE = 2 * 60 * 59;

/** 微信获取 access_key 接口 */
export const WECHAT_ACCESS_KEY_URL = " https://api.weixin.qq.com/cgi-bin/token";

/** 微信客服消息调用接口 */
export const WECHAT_CGI_URL =
  "https://api.weixin.qq.com/cgi-bin/message/custom/send";
