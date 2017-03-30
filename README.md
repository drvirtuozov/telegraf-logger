## Example Usage
```js
const Telegraf = require('telegraf');
const telegrafLogger = require('telegraf-logger');


const bot = new Telegraf('TOKEN');
bot.use(telegrafLogger());

```