/* eslint-disable no-underscore-dangle */
class TelegrafLogger {
  constructor(options) {
    this.options = Object.assign({
      log: console.log,
      format: '%botUsername => *%sceneId* [%username] %firstName %lastName (%id): <%updateType> %content',
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

        default: content = '';
      }

      const text = this.options.format
        .replace(/%botUsername/g, ctx.me || null)
        .replace(/%sceneId/g, (ctx.session && ctx.session._flow && ctx.session._flow.id) || null)
        .replace(/%username/g, ctx.from.username || null)
        .replace(/%firstName/g, ctx.from.first_name)
        .replace(/%lastName/g, ctx.from.last_name || '')
        .replace(/%id/g, ctx.from.id)
        .replace(/%updateType/g, ctx.updateSubType || ctx.updateType)
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
