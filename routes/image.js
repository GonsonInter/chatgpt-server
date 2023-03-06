/**
 * @author gsjt
 * @description 图片相关
 */

import routerCreater from 'koa-router'
import { getImageByPrompt } from '../services/image.js'

const router = routerCreater()

router.prefix('/chat-server/api/image')

router.get('/generate', async (ctx, next) => {
  try {
    const { prompt, number, size } = ctx.query
    const res = await getImageByPrompt(prompt, number, size)
    ctx.body = res
  } catch (e) {
    ctx.body = {
      error: e
    }
  }
})

export default router