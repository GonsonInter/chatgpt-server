/**
 * redis 连接
 */

import redis from "redis";
import { REDIS_CONF, MSG_EXPIRE_TIME } from "./constants.js";

// // 创建客户端
// const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
// redisClient.on("message", (msg) => {
//   console.log(">>>>>>>>>>>>>>> redis 消息：", msg);
// });

/**
 *
 * set
 * @param {string} key 键
 * @param {string} val 值
 * @param {number} [timeout = MSG_EXPIRE_TIME] 过期时间 单位s
 */
export const redisSet = (key, val, timeout = MSG_EXPIRE_TIME) => {
  // 这里需要判断一下，如果传递的val值是对象，我们需要将其转换为json字符串再进行存储
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val);
  redisClient.expire(key, timeout);
};

/**
 *
 * get
 * @param {string} key
 * @return {promise}
 */
export const redisGet = (key) => {
  // 因为涉及到IO操作，所以是异步处理，需要用promise包装一下
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
      }
      if (val == null) {
        resolve(val);
      }
      try {
        resolve(JSON.parse(val));
      } catch (error) {
        resolve(val);
      }
    });
  });
  return promise;
};
