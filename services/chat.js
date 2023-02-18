/**
 * @author 王子杰
 * @description chatgpt service
 */

import { ChatGPTAPI } from 'chatgpt'
import config from '../config.js'
import { WECHAT_USER_PFX } from '../constants.js'
import { redisGet, redisSet } from '../redis.js'

const { OPENAI_API_KEY } = config

const api = new ChatGPTAPI({ apiKey: OPENAI_API_KEY })

/**
 * 调用接口询问问题
 * @param {*} question 问题内容
 * @param {*} conversationId 当前的对话ID
 * @param {*} parentMessageId 当前对话上文ID
 */
const askQuestion = async (question, conversationId, parentMessageId) => {

    if (!conversationId) {
        return await api.sendMessage(question)
    }

    return await api.sendMessage(question, {
        conversationId: conversationId,
        parentMessageId: parentMessageId
    })
}

const setLastConversation = async (userId, conversationId, messageId) => {
    redisSet(`${WECHAT_USER_PFX}${userId}`, { conversationId, parentMessageId: messageId })
}

const getLastConversation = async (userId) => {
    return await redisGet(`${WECHAT_USER_PFX}${userId}`)
}

export {
    askQuestion,
    setLastConversation,
    getLastConversation
}