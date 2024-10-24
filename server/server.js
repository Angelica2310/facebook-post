import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors()); // let servers talk to each other
app.use(express.json());

// create my test endpoint
app.get("/", function (req, res) {
  res.json("This is my root!");
});

// setup our database connection
const db = new pg.Pool({ connectionString: process.env.DB_CONN_STRING });

// POST request to insert data into Supabase
app.post("/post-comment", async function (req, res) {
  // get the request body (data from the form)
  const { message, name } = req.body;
  console.log(name, message);
  try {
    await db.query("INSERT INTO facebook_post(name, message) VALUES ($1, $2)", [
      name,
      message,
    ]);
    res.status(201).json({ message: "Post added successfully!" });
  } catch (error) {
    console.log("Error executing query", error);
    res.status(500).json({ error: "Failed to insert post" });
  }
});

// GET request to fetch data from Supabase
app.get("/post-comment", async function (req, res) {
  try {
    const result = await db.query("SELECT * FROM facebook_post");
    res.json(result.rows);
  } catch (error) {
    console.log("Error executing query", error);
    res.status(500).json({ error: "Failed to insert post" });
  }
});

// PUT request to update data in Supabase
app.put("/post-comment/:id", async function (req, res) {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const result = await db.query(
      "UPDATE facebook_post SET message = $1 WHERE id = $2",
      [message, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.log("Error updating comment", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, function () {
  console.log("App is running on PORT 3000");
});
