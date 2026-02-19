import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { AuthService } from '../services/auth.service'

type C = Context<AuthEnv>

export const AuthController = {
  async signup(c: C) {
    const body = c.req.valid('json' as never) as { email: string; password: string }
    const user = await AuthService.signup(body.email, body.password)
    return c.json({ success: true, data: { user } }, 201)
  },

  async login(c: C) {
    const body = c.req.valid('json' as never) as { email: string; password: string }
    const result = await AuthService.login(body.email, body.password)
    return c.json({ success: true, data: result })
  },

  async getMe(c: C) {
    const user = c.get('user')
    const data = await AuthService.getMe(user.id)
    return c.json({ success: true, data: { user: data } })
  },
}
