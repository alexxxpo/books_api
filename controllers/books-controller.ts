import e, { Request, Response } from "express";
import { prisma } from '../prisma/prisma-client'
import { BookType } from "../types";

export class BooksController {
	async addBook(req: Request<{}, {}, BookType>, res: Response) {
		const { author, title, genres = '' } = req.body;
		if (!author || !title) {
			return res.status(400).send({ error: 'Поля Автор и Заголовок обязательны' })
		}

		try {
			const existBook = await prisma.book.findFirst({
				where: {
					title
				}
			})

			if (existBook) {
				return res.status(400).json({ error: 'Книга с таким заголовком уже существует' })
			}

			const newBook = await prisma.book.create({
				data: {
					author,
					title,
					genres,
				}
			})
			return res.status(201).json(newBook)

		} catch (error) {
			console.error(error, 'Ошибка при создании книги');
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getAllBooks(req: Request, res: Response) {
		try {
			const books = await prisma.book.findMany()

			return res.status(201).json(books)

		} catch (error) {
			console.error(error, 'Ошибка при получении списка книг');
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getBookById(req: Request<{ id: string }>, res: Response) {
		const id = +req.params.id
		try {
			const book = await prisma.book.findUnique({
				where: {
					id
				}
			})

			return res.status(201).json(book)

		} catch (error) {
			console.error(error, 'Ошибка при получении книги по id');
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async updateBook(req: Request<{ id: string }, {}, BookType>, res: Response) {

		const id = +req.params.id;

		const { author, title, genres } = req.body;

		if (author === '') {
			return res.status(400).send({ error: 'Поле Автор не может быть пустым' })
		}

		if (title === '') {
			return res.status(400).send({ error: 'Поле Заголовок не может быть пустым' })
		}

		try {
			const existBook = await prisma.book.findUnique({
				where: { id }
			})

			if (!existBook) {
				return res.status(404).json({ error: 'Такой книги не существует' })
			}

			const existBookWithTitle = await prisma.book.findFirst({
				where: {
					title
				}
			})

			if (existBookWithTitle && existBook.title !== existBookWithTitle.title) {
				return res.status(400).json({ error: 'Книга с таким заголовком уже существует' })
			}

			const updateObject: BookType = {};

			if (author !== undefined) updateObject.author = author;
			if (title !== undefined) updateObject.title = title;
			if (genres !== undefined) updateObject.genres = genres;

			const editedBook = await prisma.book.update({
				where: { id },
				data: updateObject
			})
			return res.status(201).json(editedBook)

		} catch (error) {
			console.error(error, 'Ошибка при обновлении книги');
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async deleteBook(req: Request<{ id: string }>, res: Response) {
		const id = +req.params.id;
		try {
			const existBook = await prisma.book.findUnique({
				where: { id }
			})

			if (!existBook) {
				return res.status(400).json({ error: 'Такой книги не существует' })
			}

			await prisma.book.delete({
				where: { id }
			})

			res.sendStatus(200)

		} catch (error) {
			console.error(error, 'Ошибка при удалении книги');
			res.status(500).json({ error: "Internal server error" });
		}
	}
}


export const booksController = new BooksController();