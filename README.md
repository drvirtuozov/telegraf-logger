## Example Usage
```js
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');


const bot = new Telegraf('TOKEN');

// Pass the desired logger in this way
const logger = new TelegrafLogger({
  log: AwesomeLogger.log, // default: console.log
  format: '%updateType => @%username %firstName %lastName (%fromId): <%updateSubType> %content', // default; replace or remove placeholders as necessary
  contentLength: 100, // default
}); // All the default values can be omitted

// The full list of available placeholders can be found below

// To attach the middleware to the bot call the .middleware() method
bot.use(logger.middleware());
```
### Available Placeholders
```
botUsername, username, firstName, lastName, fromId, chatId, chatType, chatTitle, chatUsername, updateId, updateType, updateTypeId, updateSubType, sceneId
```