import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import type {
  RegisterRequest,
  RegisterResponseBody,
} from '#controllers/interfaces/register.interface'
import AuthService from '#services/auth/auth_service'

export default class AuthController {
  async register({ request, response }: HttpContext): Promise<void> {
    const payload: RegisterRequest = await request.validateUsing(registerValidator)
    const user: RegisterResponseBody = await AuthService.register(payload)
    return response.status(201).json(user)
  }

  async login({ request, response }: HttpContext): Promise<void> {
    const { email, password } = await request.validateUsing(loginValidator)

    const { token, user } = await AuthService.login(email, password)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }
}
