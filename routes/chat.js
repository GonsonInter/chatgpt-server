/**
 * @author gsjt
 * @description 聊天相关
 */

import routerCreater from 'koa-router'
import { askQuestion } from '../services/chat.js'

const router = routerCreater()

router.prefix('/chat-server/api/chat')

router.get('/question', async (ctx, next) => {
   try {
      const { question, conversationId, parentMesageId } = ctx.query
      const res = await askQuestion(question, conversationId, parentMesageId)
      ctx.body = res
   } catch (e) {
      ctx.body = {
         error: e
      }
   }
})

router.post('/question', async (ctx, next) => {
   try {
      const { question, conversationId, parentMesageId } = ctx.request.body
      const res = await askQuestion(question, conversationId, parentMesageId)
      ctx.body = res
   } catch (e) {
      ctx.body = {
         error: e
      }
   }
})

export default router