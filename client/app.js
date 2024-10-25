const commentContainer = document.getElementById("comment-container");
const commentForm = document.getElementById("comment-form");

// Function to fetch comments and display them
async function getComment() {
  const res = await fetch(
    "https://facebook-post-server.onrender.com/post-comment"
  );
  const post = await res.json();

  // Clear previous comments
  commentContainer.innerHTML = "";

  for (let i = 0; i < post.length; i++) {
    const name = post[i].name;
    const message = post[i].message;
    const id = post[i].id;

    const commentDiv = document.createElement("div"); // Create container for each comment
    commentDiv.classList.add("comment-div");

    const p = document.createElement("p");
    p.textContent = `${name}: ${message}`;

    commentDiv.appendChild(p);

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.onclick = async function () {
      const newMessage = prompt("Edit your comment:", message);
      if (newMessage) {
        // update the p element with the new message
        p.textContent = `${name}: ${newMessage}`;

        // Send a PUT request to update the message in the database
        try {
          await fetch(
            `https://facebook-post-server.onrender.com/post-comment/${id}`,
            {
              method: "PUT",
              body: JSON.stringify({ message: newMessage }),
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.log("Error executing query", error);
        }
      }
    };

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.onclick = async function () {
      // Function to send DELETE request to server
      try {
        console.log(`Deleting comment with ID: ${id}`);
        await fetch(
          `https://facebook-post-server.onrender.com/post-comment/${id}`,
          {
            method: "DELETE",
          }
        );
        // Remove comment
        commentContainer.removeChild(commentDiv);
      } catch (error) {
        console.log("Error deleting comment", error);
      }
    };

    // Append comment and button to comment container

    commentDiv.appendChild(editBtn);
    commentDiv.appendChild(deleteBtn);
    commentContainer.appendChild(commentDiv);
  }
}

getComment();

// Function to handle form submission
async function handleSubmitPost(e) {
  e.preventDefault();

  // Use formData on the form
  const formData = new FormData(commentForm);
  const formObj = Object.fromEntries(formData);
  console.log(formObj);

  const response = await fetch(
    "https://facebook-post-server.onrender.com/post-comment",
    {
      method: "POST",
      body: JSON.stringify(formObj),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  console.log(data);
  commentForm.reset();
  getComment(); // Refresh the comment list after submitting
}
commentForm.addEventListener("submit", handleSubmitPost);

// Icon event listener
const likeIcon = document.querySelector(".like-icon");
const countDisplay = document.querySelector(".count-display");
const commentIcon = document.querySelector(".comment-icon");
const nameInput = document.getElementById("name");
const shareIcon = document.getElementById("share-icon");
const overlay = document.getElementById("overlay");
const popupDialog = document.getElementById("popupDialog");
const closeButton = document.getElementById("close-btn");

let count = 0;

likeIcon.addEventListener("click", function () {
  count++;
  countDisplay.textContent = count;
  if (count > 0) {
    countDisplay.style.display = "inline";
  }
});

commentIcon.addEventListener("click", function () {
  nameInput.focus();
});

function showPopup() {
  overlay.style.display = "block";
  popupDialog.style.display = "block";
}

function closePopup() {
  overlay.style.display = "none";
  popupDialog.style.display = "none";
}

shareIcon.addEventListener("click", showPopup);
closeButton.addEventListener("click", closePopup);

overlay.addEventListener("click", closePopup);
