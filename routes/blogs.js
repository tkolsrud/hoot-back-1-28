import { Router } from 'express'
import * as blogsCtrl from '../controllers/blogs.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// Public Routes

// Protected Routes
router.use(decodeUserFromToken)
router.get('/', checkAuth, blogsCtrl.index)
router.post('/', checkAuth, blogsCtrl.create)
router.get('/:id', checkAuth, blogsCtrl.show)
router.put('/:id', checkAuth, blogsCtrl.update)
router.delete('/:id', checkAuth, blogsCtrl.delete)
router.post('/:id/comments', checkAuth, blogsCtrl.createComment)

export { router }