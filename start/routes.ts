/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth/auth_controller')
const AuthGoogleController = () => import('#controllers/auth/auth_google_controller')
const AuthFacebookController = () => import('#controllers/auth/auth_facebook_controller')
const ActivationsController = () => import('#controllers/activation/activations_controller')
const PasswordResetsController = () =>
  import('#controllers/password_reset/password_resets_controller')

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.post('register', [AuthController, 'register'])
            router.post('login', [AuthController, 'login'])

            router.get('google/redirect', [AuthGoogleController, 'redirect'])
            router.get('google/signin/callback', [AuthGoogleController, 'handleCallback'])

            router.get('facebook/redirect', [AuthFacebookController, 'redirect'])
            router.get('facebook/signin/callback', [AuthFacebookController, 'handleCallback'])
          })
          .prefix('auth') // Basic Auth  ---

        router
          .get('me', async ({ auth, response }) => {
            try {
              const user = auth.getUserOrFail()
              return response.ok(user)
            } catch (error) {
              return response.unauthorized({
                message: 'You are not authorized to access this resource',
              })
            }
          })
          .use(middleware.auth()) // Protected routes ---

        router
          .group(() => {
            router.post('activate', [ActivationsController, 'activate'])
            router.post('forgot-password', [PasswordResetsController, 'forgot'])
            router.post('reset-password', [PasswordResetsController, 'reset'])
          })
          .prefix('user') // User routes ---
      })
      .prefix('v1')
  })
  .prefix('api')
