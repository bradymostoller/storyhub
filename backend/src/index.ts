import express, { Request, Response } from "express";
import prisma from "./prisma";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// Endpoint to create a user
app.post("/users", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // No hashing
      },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: "Unable to create user" });
  }
});

// Endpoint for user login
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Attempt to find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    if (password !== user.password) {
      // Ensure this comparison is case-sensitive
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If successful, respond with a token or user data
    res.json({ token: user.email }); // Consider returning a JWT or similar token in real applications
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ error: "Unable to log in" });
  }
});

// Endpoint to fetch a user's books or all books
app.get("/books", async (req: Request, res: Response) => {
  const userId = req.query.userId as string; // Use query parameter for optional userId

  try {
    // If userId is provided, fetch books for that user
    if (userId) {
      const books = await prisma.book.findMany({
        where: { userId: parseInt(userId) }, // Ensure userId is an integer
      });
      return res.json(books);
    }

    // If no userId is provided, fetch all books
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch books" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { pages: true },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bookId = parseInt(id);

    // First delete pages linked to the book
    await prisma.page.deleteMany({
      where: { bookId },
    });

    // Then delete the book
    await prisma.book.delete({
      where: { id: bookId },
    });

    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Unable to delete book" });
  }
});



app.post("/books", async (req: Request, res: Response) => {
  try {
    const { title, pages, description, userId } = req.body;

    // Check if pages is defined and is an array
    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: "Pages must be a valid array" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newPages = pages.map((page) => ({
      text: page.text,
      imageUrl: page.imageUrl,
    }));

    console.log(userId);

    // Create the book using your database model or ORM
    const newBook = await prisma.book.create({
      data: {
        title,
        description,
        pages: {
          create: newPages,
        },
        user: {
          // Change here to connect the user by email
          connect: { email: userId }, // Use the email field to connect the user
        },
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Unable to create book" });
  }
});

app.put("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, pages } = req.body;

  try {
    const bookId = parseInt(id);

    // First, delete existing pages
    await prisma.page.deleteMany({
      where: { bookId },
    });

    // Then update the book with new data
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        title,
        description,
        pages: {
          create: pages.map((page: any) => ({
            text: page.text,
            imageUrl: page.imageUrl,
          })),
        },
      },
      include: { pages: true },
    });

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Unable to update book" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
