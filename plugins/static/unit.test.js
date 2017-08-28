const run = require('server/test/run');
const stat = require('./');
const error = require('server/router/error');
const path = require('path');
const fs = require('fs');

describe('static plugin', () => {
  it('exists', async () => {
    await run().get('/');
    expect(stat).toBeDefined();
    expect(stat.name).toBe('static');
    expect(stat.options).toBeDefined();
  });

  it.only('static', async () => {
    const res = await run({ public: 'test' }, [
      async ctx => {
        console.log('Calling here', ctx.options.public);
        // const file = path.join(ctx.options.public, ctx.url);
        return JSON.stringify({
          pub: ctx.options.public,
          url: ctx.url,
          message: 'I am displayed',
          exists: fs.existsSync(path.join(ctx.options.public, ctx.url))
        });
        // console.log(file, ':', (await fs.readFile(file, 'utf8')).length);
      }
    ]).get('/logo.png');
    expect(res.body.slice(0, 100)).toBe(res.statusCode);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
  });

  it('non-existing static', async () => {
    const res = await run({ public: 'test' }).get('/non-existing.png');
    expect(res.statusCode).toBe(404);
  });

});
