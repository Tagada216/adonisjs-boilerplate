import User from '#models/user'
import env from '#start/env'
import { AuthProviders } from '../../enums/auth-providers.enum.js'
import { isUniqueProvider } from '../../guards/auth_provider_guard.js'

class SocialAuthService {
  async handleFacebookCallback(facebookUser: any): Promise<{ token: string; user: any } | string> {
    if (facebookUser.accessDenied()) {
      return 'Access Denied'
    }

    if (facebookUser.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (facebookUser.hasError()) {
      return facebookUser.getError()
    }

    const user = await facebookUser.user()

    const isProviderVerified = await isUniqueProvider(user.email, AuthProviders.facebook)

    if (!isProviderVerified) {
      return `Already exists on other provider`
    }

    const findUser = {
      email: user.email as string,
    }

    const userDetails = {
      email: user.email,
      fullName: user.original.first_name,
      provider: AuthProviders.facebook,
      providerId: user.id,
    }

    const newUser = await User.firstOrCreate(findUser, userDetails)

    const token = await User.accessTokens.create(newUser, ['*'], {
      expiresIn: env.get('JWT_EXPIRY'),
    })

    return { token: token.toString(), user: newUser }
  }

  async handleGoogleCallback(googleUser: any): Promise<{ token: string; user: any } | string> {
    if (googleUser.accessDenied()) {
      return 'Access Denied'
    }

    if (googleUser.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (googleUser.hasError()) {
      return googleUser.getError()
    }

    const user = await googleUser.user()

    const isProviderVerified = await isUniqueProvider(user.email, AuthProviders.google)

    if (!isProviderVerified) {
      return `Already exists on other provider`
    }

    const findUser = {
      email: user.email,
    }

    const userDetails = {
      email: user.email,
      fullName: user.original.given_name,
      provider: AuthProviders.google,
      providerId: user.id,
    }

    const newUser = await User.firstOrCreate(findUser, userDetails)

    const token = await User.accessTokens.create(newUser, ['*'], {
      expiresIn: env.get('JWT_EXPIRY'),
    })

    return { token: token.toString(), user: newUser }
  }
}

export default new SocialAuthService()
