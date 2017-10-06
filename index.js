/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

class TelegrafLogger {
  constructor(options) {
    this.options = Object.assign({
      log: console.log,
      format: '@%username %firstName %lastName (%fromId): <%updateType> %content',
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
        .replace(/%botUsername/g, ctx.me || null)
        .replace(/%username/g, ctx.from.username || null)
        .replace(/%firstName/g, ctx.from.first_name)
        .replace(/%lastName/g, ctx.from.last_name || '')
        .replace(/%fromId/g, ctx.from.id)
        .replace(/%chatId/g, ctx.chat.id)
        .replace(/%messageId/g, ctx.message.message_id)
        .replace(/%updateType/g, ctx.updateType)
        .replace(/%updateSubType/g, ctx.updateSubType || ctx.updateSubTypes[0] || ctx.updateType)
        .replace(/%sceneId/g, (ctx.session && ctx.session._flow && ctx.session._flow.id) || null)
        .replace(/ +|\n/g, ' ');

      content = content.replace(/\n/g, ' ');

      if (content.length > this.options.contentLength) {
        content = `${content.slice(0, this.options.contentLength)}...`;
      }

      this.options.log(text.replace(/%content/g, content));
      return next();
    };
  }
}

module.exports = TelegrafLogger;
