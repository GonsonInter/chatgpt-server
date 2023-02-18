/**
 * @author 王子杰
 * @description 微信验证相关方法
 */

import crypto from 'crypto'

/** SHA1 加密方法 */
const shasum = crypto.createHash('sha1')

/**
 * 官方文档 https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
 * 1）将token、timestamp、nonce三个参数进行字典序排序
 * 2）将三个参数字符串拼接成一个字符串进行sha1加密
 * 3）开发者获得加密后的字符串可与 signature 对比，标识该请求来源于微信
 */
const validateWechatSignature = async (token, timestamp, nonce, signature) => {
    return signature ===
        shasum
            .update([token, timestamp, nonce]
                .sort()
                .join(''))

}

export {
    validateWechatSignature
}