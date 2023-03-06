/**
 * @author gsjt
 * @description 微信相关
 */

import routerCreater from "koa-router";
import getRawBody from "raw-body";
import { validateWechatSignature, sendCgiMessage } from "../services/wechat.js";
import {
  parseXMLAsync,
  formatTextXMLString,
  replyTextMatchMessage,
} from "../utils.js";
import {
  askQuestion,
  getLastConversation,
  setLastConversation,
} from "../services/chat.js";
import config from "../config.js";

const { WECHAT_TOKEN } = config;

const router = routerCreater();

router.prefix("/chat-server/api/wechat");

router.get("/checkToken", async (ctx, next) => {
  const { signature, timestamp, nonce, echostr } = ctx.query;
  ctx.body = validateWechatSignature(WECHAT_TOKEN, timestamp, nonce, signature)
    ? echostr
    : "not wechat message!";
});

router.post("/checkToken", async (ctx, next) => {
  const { signature, timestamp, nonce } = ctx.query;

  if (!validateWechatSignature(WECHAT_TOKEN, timestamp, nonce, signature))
    ctx.body = "";

  const data = await getRawBody(ctx.req, {
    length: ctx.request.length,
    limit: "1mb",
    encoding: ctx.request.charset,
  });

  const content = await parseXMLAsync(data);

  const { FromUserName, ToUserName, MsgId, MsgType, Event, Content } =
    content.xml;

  /** 处理事件 */
  if (MsgType[0] === "event") {
    if (Event[0] === "subscribe") {
      return (ctx.body = formatTextXMLString(
        ToUserName,
        FromUserName,
        "感谢关注，可以发送消息了。"
      ));
    }
    return (ctx.body = "");
  }

  if (MsgType[0] !== "text") {
    return (ctx.body = formatTextXMLString(
      ToUserName,
      FromUserName,
      "暂时不支持非文本类型。"
    ));
  }

  /** 匹配关键字回复 */
  const normalReply = await replyTextMatchMessage(Content[0]);

  /** 如果匹配到关键字，直接回复内容 */
  if (normalReply) {
    return (ctx.body = formatTextXMLString(ToUserName, FromUserName, normalReply));
  }

  const { conversationId, parentMessageId } =
    (await getLastConversation(FromUserName)) || {};

  /** 首先给微信回复，以免超时（微信同步消息回复时间限制5s） */
  ctx.body = "success";

  const answer = await askQuestion(Content[0], conversationId, parentMessageId);
  setLastConversation(FromUserName, answer.conversationId, answer.id);

  // /** 客服消息向客户异步发送消息 */
  // sendCgiMessage(FromUserName, answer.text);

  /** 返回时将发送者和被发送者对调 */
  ctx.body = formatTextXMLString(ToUserName, FromUserName, answer.text);
});

export default router;
