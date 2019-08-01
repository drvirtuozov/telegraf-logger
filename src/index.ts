import { ContextMessageUpdate, Middleware } from 'telegraf';

class TelegrafLogger {
  private options: LoggerOptions = {
    log: console.log,
    format: '%ut => @%u %fn %ln (%fi): %c',
    contentLength: 100,
  } 

  constructor(options?: LoggerOptions) {
    if (options) {
      this.options = {...this.options, ...options};
    }
  }

  public middleware(): Middleware<ContextMessageUpdate> {
    return (ctx: ContextMessageUpdate, next: Function) => {
      let content: string | undefined;
      let updateTypeId: string | number | undefined;

      switch (ctx.updateType) {
        case 'message':
          updateTypeId = ctx.message.message_id;

          if (ctx.message.text) {
            content = ctx.message.text;
          } else if (ctx.message.sticker) {
            content = ctx.message.sticker.emoji;
          } else {
            content = '';
          }

          break;

        case 'edited_message':
          updateTypeId = ctx.editedMessage.message_id;
          content = ctx.editedMessage.text || '';
          break;

        case 'channel_post':
          updateTypeId = ctx.channelPost.message_id;

          if (ctx.channelPost.text) {
            content = ctx.channelPost.text;
          } else if (ctx.channelPost.sticker) {
            content = ctx.channelPost.sticker.emoji;
          } else {
            content = '';
          }

          break;

        case 'edited_channel_post':
          updateTypeId = ctx.editedChannelPost.message_id;
          content = ctx.editedChannelPost.text || '';
          break;

        case 'callback_query':
          updateTypeId = ctx.callbackQuery.id;
          content = ctx.callbackQuery.data || '';
          break;

        case 'inline_query':
          updateTypeId = ctx.inlineQuery.id;
          content = ctx.inlineQuery.query || '';
          break;

        case 'chosen_inline_result':
          updateTypeId = ctx.chosenInlineResult.result_id;
          content = ctx.chosenInlineResult.query || '';
          break;

        case 'shipping_query':
          updateTypeId = ctx.shippingQuery.id;
          content = ctx.shippingQuery.invoice_payload || '';
          break;

        case 'pre_checkout_query':
          updateTypeId = ctx.preCheckoutQuery.id;
          content = ctx.preCheckoutQuery.invoice_payload || '';
          break;

        default:
          content = '';
          updateTypeId = null;
      }
      
      const { from, chat } = ctx;
      const text = this.options.format
        .replace(/%me\b/igm, ctx.me || null)
        .replace(/%u\b/igm, from.username || null)
        .replace(/%fn\b/igm, from.first_name)
        .replace(/%ln\b/igm, from.last_name || '')
        .replace(/%fi\b/igm, String(from.id))
        .replace(/%ci\b/igm, String(chat.id) || null)
        .replace(/%ct\b/igm, chat.type || null)
        .replace(/%ctl\b/igm, chat.title || null)
        .replace(/%cu\b/igm, chat.username || null)
        .replace(/%ui\b/igm, String(ctx.update.update_id))
        .replace(/%ut\b/igm, ctx.updateType)
        .replace(/%uti\b/igm, String(updateTypeId))
        .replace(/ +/g, ' ');

      if (content.length > this.options.contentLength) {
        content = `${content.slice(0, this.options.contentLength)}...`;
      }

      this.options.log(text.replace(/%c\b/igm, content.replace(/\n/g, ' ')));
      return next();
    };
  }
}


interface LoggerOptions {
  log?: Function;
  format?: string;
  contentLength?: number;
}

export default TelegrafLogger;
