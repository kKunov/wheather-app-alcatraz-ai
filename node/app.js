const fs = require('fs');
const Koa = require('koa');
const cors = require('koa-cors');

const app = new Koa();
const routers = require('./routes/main.js');

const koaRequest = require('koa-http-request');

fs.readFile('./openWeatherClientId.txt', (err, data) => {
    if (err) {
        console.log(err);
    }
    else {
        global.openWeatherClientId = data;
    }
});

app.use(cors());

app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: 'https://api.openweathermap.org/data/2.5'
}));

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// get responce time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(routers.routes());

app.listen(9000);