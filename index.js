class TelegrafLogger {

  constructor(options) {
    this.options = Object.assign({
      log: console.log,
    }, options);
  }

  middleware() {
    return (ctx, next) => {
      const { username, first_name: firstName, last_name: lastName, id } = ctx.from;
      let content = null;

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

      const text = `${ctx.me ? `${ctx.me} => ` : ''}${username ? `[${username}]` : ''} ${firstName + (lastName ? ` ${lastName}` : '')} (${id}): <${ctx.updateSubType || ctx.updateType}> ${content.replace(/\n/g, ' ')}`;
      this.options.log(text.length > 200 ? `${text.slice(0, 200)}...` : text);
      next();
    };
  }
}

module.exports = TelegrafLogger;
