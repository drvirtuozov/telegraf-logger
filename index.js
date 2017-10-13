/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

class TelegrafLogger {
  constructor(options) {
    this.options = Object.assign({
      log: console.log,
      format: '%updateType => @%username %firstName %lastName (%fromId): <%updateSubType> %content',
      contentLength: 100,
    }, options);
  }

  middleware() {
    return (ctx, next) => {
      let content;
      let updateTypeId;

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

      const { from = {}, chat = {}, session = {}, updateSubTypes = [] } = ctx;
      const text = this.options.format
        .replace(/%botUsername\b/igm, ctx.me || null)
        .replace(/%username\b/igm, from.username || null)
        .replace(/%firstName\b/igm, from.first_name)
        .replace(/%lastName\b/igm, from.last_name || '')
        .replace(/%fromId\b/igm, from.id)
        .replace(/%chatId\b/igm, chat.id || null)
        .replace(/%chatType\b/igm, chat.type || null)
        .replace(/%chatTitle\b/igm, chat.title || null)
        .replace(/%chatUsername\b/igm, chat.username || null)
        .replace(/%updateId\b/igm, ctx.update.update_id)
        .replace(/%updateType\b/igm, ctx.updateType)
        .replace(/%updateTypeId\b/igm, updateTypeId)
        .replace(/%updateSubType\b/igm, ctx.updateSubType || updateSubTypes[0] || ctx.updateType)
        .replace(/%sceneId\b/igm, (session._flow && session._flow.id) || null)
        .replace(/ +/g, ' ');

      if (content.length > this.options.contentLength) {
        content = `${content.slice(0, this.options.contentLength)}...`;
      }

      this.options.log(text.replace(/%content\b/igm, content.replace(/\n/g, ' ')));
      return next();
    };
  }
}

module.exports = TelegrafLogger;
