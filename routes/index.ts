import { Router } from 'express';
import { booksController, userController } from '../controllers';
import { authenticateToken } from '../middleware/auth';
import { authorization } from '../middleware/authorization';

const router = Router();

// Books routes
router.post('/books', authenticateToken, authorization(0b11), booksController.addBook);
router.get('/books', booksController.getAllBooks);
router.get('/books/:id', booksController.getBookById);
router.put('/books/:id', authenticateToken, authorization(0b11), booksController.updateBook);
router.delete('/books/:id', authenticateToken, authorization(0b11), booksController.deleteBook);

//User routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/me', authenticateToken, userController.current);
router.put('/users/:id/role', authenticateToken, authorization(0b11), userController.changeRole);

export default router;