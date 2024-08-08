import { Router } from 'express';
import { booksController, userController } from '../controllers';
import { authenticateToken } from '../middleware/auth';
import { authorization } from '../middleware/authorization';

const router = Router();

// Books routes
router.post('/books', authenticateToken, booksController.addBook);
router.get('/books', booksController.getAllBooks);
router.get('/books/:id', booksController.getBookById);
router.put('/books/:id', authenticateToken, booksController.updateBook);
router.delete('/books/:id', authenticateToken, booksController.deleteBook);

//User routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/me', authenticateToken, authorization, userController.current);
router.put('/users/:id/role',authenticateToken, userController.changeRole);

export default router;