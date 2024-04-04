import User from '#models/user'
import { AuthProviders } from '../enums/auth-providers.enum.js'

export async function isUniqueProvider(
  email: string,
  currentProvider: AuthProviders
): Promise<Boolean> {
  const existingUser = await User.query().where('email', email).first()

  if (existingUser) {
    if (existingUser.provider !== currentProvider) {
      return false
    }
  }
  return true
}
