## Example Usage
```js
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');


const bot = new Telegraf('TOKEN');

// Pass the desired logger in this way
const Logger = new TelegrafLogger({log: AwesomeLogger.log});

// To attach the middleware to the bot call the .middleware() function
bot.use(Logger.middleware());
```