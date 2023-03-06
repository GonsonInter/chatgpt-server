/**
 * @author 狗剩集团
 * @description image service
 */

import config from '../config.js'
import fetch from 'node-fetch'
import { OPENAI_IMAGE_URL } from '../constants.js'

const { OPENAI_API_KEY } = config

/**
 * 生成图片
 * @param {*} prompt 图片提示
 * @param {*} number 生成数量 （1 - 10）
 * @param {*} size 图片大小
 */
const getImageByPrompt = async (prompt, number = 1, size = "512x512") => {
  try {
    const res = await fetch(OPENAI_IMAGE_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        n: number,
        size
      })
    })

    return await res.json()
  } catch (e) {
    return e
  }
}



export {
  getImageByPrompt
}