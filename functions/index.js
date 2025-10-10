const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

admin.initializeApp();

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;
      res.status(200).send({count});
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

exports.capitalizeBookData = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { isbn, name } = req.body;
      
      if (!isbn || !name) {
        res.status(400).send({ error: 'ISBN and name are required' });
        return;
      }
      
      // Capitalize the book name
      const capitalizedName = name.toUpperCase();
      
      // Add to Firestore with capitalized data
      const booksCollection = admin.firestore().collection("books");
      const docRef = await booksCollection.add({
        isbn: Number(isbn),
        name: capitalizedName,
        originalName: name, // Keep original for reference
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(200).send({
        success: true,
        id: docRef.id,
        data: {
          isbn: Number(isbn),
          name: capitalizedName,
          originalName: name
        }
      });
      
    } catch (error) {
      console.error("Error capitalizing book data:", error.message);
      res.status(500).send({ error: "Error processing book data" });
    }
  });
});
