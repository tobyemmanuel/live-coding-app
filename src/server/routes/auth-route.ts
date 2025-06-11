import { Router } from 'express'
import authController from '../controllers/auth-controller'
import OrganisationController from '../controllers/organisation-controller'

const auth = Router()

auth.post('/register', authController.register)
auth.post('/login', authController.login)
auth.post('/logout', authController.logout)
auth.post('/forgot-password', authController.forgotPassword)
auth.post('/register/organisation', OrganisationController.createOrganisation)

export { auth }
