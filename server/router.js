import Router from 'koa-router'

const router = new Router()

export default app => app.use(router.routes()).use(router.allowedMethods())
