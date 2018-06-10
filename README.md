## Example Usage
```js
const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');


const bot = new Telegraf('TOKEN');

// Pass the desired logger in this way
const logger = new TelegrafLogger({
  log: AwesomeLogger.log, // default: console.log
  // replace or remove placeholders as necessary
  format: '%ut => @%u %fn %ln (%fi): <%ust> %c', // default
  contentLength: 100, // default
}); // All the default values can be omitted

// The full list of available placeholders can be found below

// To attach the middleware to the bot call the .middleware() method
bot.use(logger.middleware());
```
### Available Placeholders
The following format specifiers stands for:
```
%me — bot username
%u — username
%fn — first name
%ln — last name
%fi — from id
%ci — chat id
%ct — chat type
%ctl — chat title
%cu — chat username
%ui — update id
%ut — update type
%uti — update type id
%ust — update sub type
%si — scene id
%c — content
```