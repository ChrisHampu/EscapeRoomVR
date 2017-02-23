var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(serve('public'));

const port = process.env.PORT || 3000;

app.listen(port);

console.log(`listening on port ${port}`);