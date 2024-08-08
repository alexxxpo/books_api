import { Router } from 'express';
import { booksController } from '../controllers';

const router = Router();

router.post('/books', booksController.addBook);
router.get('/books', booksController.getAllBooks);
router.get('/books/:id', booksController.getBookById);
router.put('/books/:id', booksController.updateBook);
router.delete('/books/:id', booksController.deleteBook);

export default router;