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

      switch (ctx.updateType) {
        case 'message':
          if (ctx.message.text) {
            content = ctx.message.text;
          } else if (ctx.message.sticker) {
            content = ctx.message.sticker.emoji;
          } else {
            content = '';
          }

          break;

        case 'edited_message':
          content = ctx.editedMessage.text;
          break;

        case 'callback_query':
          content = ctx.callbackQuery.data;
          break;

        case 'inline_query':
          content = ctx.inlineQuery.query;
          break;

        case 'shipping_query':
          content = ctx.shippingQuery.invoice_payload;
          break;

        case 'pre_checkout_query':
          content = ctx.preCheckoutQuery.invoice_payload;
          break;

        default: content = '';
      }

      const text = this.options.format
        .replace(/%botUsername/igm, ctx.me || null)
        .replace(/%username/igm, ctx.from.username || null)
        .replace(/%firstName/igm, ctx.from.first_name)
        .replace(/%lastName/igm, ctx.from.last_name || '')
        .replace(/%fromId/igm, ctx.from.id)
        .replace(/%chatId/igm, ctx.chat && ctx.chat.id)
        .replace(/%chatType/igm, ctx.chat && ctx.chat.type)
        .replace(/%chatTitle/igm, (ctx.chat && ctx.chat.title) || null)
        .replace(/%chatUsername/igm, (ctx.chat && ctx.chat.username) || null)
        .replace(/%updateId/igm, ctx.update.update_id)
        .replace(/%updateType/igm, ctx.updateType)
        .replace(/%updateSubType/igm, ctx.updateSubType || ctx.updateSubTypes[0] || ctx.updateType)
        .replace(/%sceneId/igm, (ctx.session && ctx.session._flow && ctx.session._flow.id) || null)
        .replace(/ +|\n/g, ' ');

      if (content.length > this.options.contentLength) {
        content = `${content.slice(0, this.options.contentLength)}...`;
      }

      this.options.log(text.replace(/%content/igm, content).replace(/\n/g, ' '));
      return next();
    };
  }
}

module.exports = TelegrafLogger;
