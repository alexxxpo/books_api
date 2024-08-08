import { Router } from 'express';
import { booksController, userController } from '../controllers';
import { authenticateToken } from '../middleware/auth';

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
router.get('/users/me', authenticateToken, userController.current);
router.put('/users/:id/role', userController.changeRole);

export default router;