## Example Usage
```js
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');


const bot = new Telegraf('TOKEN');

// Pass the desired logger in this way
const logger = new TelegrafLogger({
  log: AwesomeLogger.log, // default: console.log
  format: '%botUsername => *%sceneId* [%username] %firstName %lastName (%id): <%updateType> %content', // default; replace or remove placeholders if you want
  contentLength: 100, // default
}); // All the default values can be omitted

// To attach the middleware to the bot call the .middleware() method
bot.use(logger.middleware());
```