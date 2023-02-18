/**
 * @author gsjt
 * @description 微信相关
 */

import routerCreater from 'koa-router'
import getRawBody from 'raw-body'
import { validateWechatSignature } from '../services/wechat.js'
import { parseXMLAsync, formatXMLString } from '../utils.js'
import { askQuestion, getLastConversation, setLastConversation } from '../services/chat.js'
import config from '../config.js'

const { WECHAT_TOKEN } = config


const router = routerCreater()

router.prefix('/chat-server/api/wechat')

router.get('/checkToken', async (ctx, next) => {
    const { signature, timestamp, nonce, echostr } = ctx.query
    ctx.body = validateWechatSignature(WECHAT_TOKEN, timestamp, nonce, signature) ?
        echostr :
        'not wechat message!'
})

router.post('/checkToken', async (ctx, next) => {
    const { signature, timestamp, nonce } = ctx.query

    if (!validateWechatSignature(WECHAT_TOKEN, timestamp, nonce, signature)) ctx.body = ""

    const data = await getRawBody(ctx.req, {
        length: ctx.request.length,
        limit: "1mb",
        encoding: ctx.request.charset
    })

    const content = await parseXMLAsync(data)

    const { FromUserName, ToUserName, MsgId, MsgType, Event, Content } = content.xml

    /** 处理事件 */
    if (MsgType[0] === 'event') {
        if (Event[0] === 'subscribe') {
            return ctx.body = formatXMLString(ToUserName, FromUserName, '感谢关注，可以发送消息了。')
        }
        return ctx.body = ''
    }

    if (MsgType[0] !== 'text') {
        return ctx.body = formatXMLString(ToUserName, FromUserName, '暂时不支持非文本类型。')
    }

    const dadTxtArr = ['王子杰是谁', '认识王子杰吗', '狗剩是谁', '认识狗剩吗', 'gou sheng', 'gousheng']

    if (new RegExp(dadTxtArr.join('|'), 'i').test(Content[0])) {
        return ctx.body = formatXMLString(ToUserName, FromUserName, '是你爹。')
    }

    const { conversationId, parentMessageId } = (await getLastConversation(FromUserName)) || {}

    const answer = await askQuestion(Content[0], conversationId, parentMessageId)
    setLastConversation(FromUserName, answer.conversationId, answer.id)

    /** 返回时将发送者和被发送者对调 */
    ctx.body = formatXMLString(ToUserName, FromUserName, answer.text)
})

export default router