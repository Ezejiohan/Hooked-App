API Documentation On Hooked-App
Base URL: https://hooked-app-7hlg.onrender.com

1. User Routes
1.1 Sign Up
Endpoint: POST /users
Description: Register a new user.
Request Body:
json
Copy code
{
  "name": "string",
  "email": "string",
  "password": "string"
}


Responses:
201 Created
json
Copy code
{
  "msg": "User created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


1.2 Login
Endpoint: POST /users/log-in
Description: Log in a user.
Request Body:
json
Copy code
{
  "email": "string",
  "password": "string"
}


Responses:
200 OK
json
Copy code
{
  "token": "string"
}


400 Bad Request
json
Copy code
{
  "msg": "Invalid credentials"
}


1.3 Verify User
Endpoint: GET /users/verifyUser/:id
Description: Verify a user account.
Params: id (User ID)
Responses:
200 OK
json
Copy code
{
  "msg": "User verified successfully"
}


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.4 Change Password
Endpoint: PUT /users/changePassword/:id
Description: Change user password.
Params: id (User ID)
Request Body:
json
Copy code
{
  "newPassword": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password updated successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


1.5 Forgot Password
Endpoint: POST /users/forgotPassword
Description: Initiate password reset.
Request Body:
json
Copy code
{
  "email": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password reset link sent"
}


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.6 Reset Password
Endpoint: PATCH /users/resetPassword/:id/:token
Description: Reset user password using token.
Params: id (User ID), token (Reset Token)
Request Body:
json
Copy code
{
  "newPassword": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password reset successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Invalid token or password"
}


1.7 Get One User
Endpoint: GET /users/:id
Description: Get details of a specific user.
Params: id (User ID)
Responses:
200 OK
json
Copy code
{
  "name": "string",
  "email": "string",
  "isVerified": "boolean"
}


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.8 Studied Card
Endpoint: POST /users/:userId/studied/:cardId
Description: Mark a card as studied by a user.
Params: userId (User ID), cardId (Card ID)
Responses:
200 OK
json
Copy code
{
  "msg": "Card marked as studied"
}


404 Not Found
json
Copy code
{
  "msg": "User or card not found"
}


1.9 Skipped Card
Endpoint: POST /users/:userId/skipped/:cardId
Description: Mark a card as skipped by a user.
Params: userId (User ID), cardId (Card ID)
Responses:
200 OK
json
Copy code
{
  "msg": "Card marked as skipped"
}


404 Not Found
json
Copy code
{
  "msg": "User or card not found"
}


1.10 In-Progress Card
Endpoint: POST /users/:userId/inProgress/:cardId
Description: Mark a card as in-progress by a user.
Params: userId (User ID), cardId (Card ID)
Responses:
200 OK
json
Copy code
{
  "msg": "Card marked as in-progress"
}


404 Not Found
json
Copy code
{
  "msg": "User or card not found"
}


1.11 Get All Studied Cards
Endpoint: GET /users/studied/:userId
Description: Get all studied cards of a user.
Params: userId (User ID)
Responses:
200 OK
json
Copy code
[
  {
    "cardId": "ObjectId",
    "date": "Date"
  }
]


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.12 Get All Skipped Cards
Endpoint: GET /users/skipped/:userId
Description: Get all skipped cards of a user.
Params: userId (User ID)
Responses:
200 OK
json
Copy code
[
  {
    "cardId": "ObjectId",
    "date": "Date"
  }
]


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.13 Get All In-Progress Cards
Endpoint: GET /users/inProgress/:userId
Description: Get all in-progress cards of a user.
Params: userId (User ID)
Responses:
200 OK
json
Copy code
[
  {
    "cardId": "ObjectId",
    "date": "Date"
  }
]


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


1.14 Save Card
Endpoint: POST /users/:userId/saveCards/:cardId
Description: Save a card for a user.
Params: userId (User ID), cardId (Card ID)
Responses:
200 OK
json
Copy code
{
  "msg": "Card saved"
}


404 Not Found
json
Copy code
{
  "msg": "User or card not found"
}


1.15 Get All Saved Cards
Endpoint: GET /users/getAllSavedCards/:userId
Description: Get all saved cards of a user.
Params: userId (User ID)
Responses:
200 OK
json
Copy code
[
  {
    "cardId": "ObjectId",
    "date": "Date"
  }
]


404 Not Found
json
Copy code
{
  "msg": "User not found"
}


2. Admin Routes
2.1 Sign Up
Endpoint: POST /admins
Description: Register a new admin.
Request Body:
json
Copy code
{
  "name": "string",
  "email": "string",
  "password": "string"
}


Responses:
201 Created
json
Copy code
{
  "msg": "Admin created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


2.2 Login
Endpoint: POST /admins/log_in
Description: Log in an admin.
Request Body:
json
Copy code
{
  "email": "string",
  "password": "string"
}


Responses:
200 OK
json
Copy code
{
  "token": "string"
}


400 Bad Request
json
Copy code
{
  "msg": "Invalid credentials"
}


2.3 Verify Admin
Endpoint: GET /admins/verifyAdmin/:id
Description: Verify an admin account.
Params: id (Admin ID)
Responses:
200 OK
json
Copy code
{
  "msg": "Admin verified successfully"
}


404 Not Found
json
Copy code
{
  "msg": "Admin not found"
}


2.4 Change Password
Endpoint: PUT /admins/changePassword/:id
Description: Change admin password.
Params: id (Admin ID)
Request Body:
json
Copy code
{
  "newPassword": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password updated successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


2.5 Forgot Password
Endpoint: POST /admins/forgotPassword
Description: Initiate password reset for admin.
Request Body:
json
Copy code
{
  "email": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password reset link sent"
}


404 Not Found
json
Copy code
{
  "msg": "Admin not found"
}


2.6 Reset Password
Endpoint: PATCH /admins/resetPassword/:id/:token
Description: Reset admin password using token.
Params: id (Admin ID), token (Reset Token)
Request Body:
json
Copy code
{
  "newPassword": "string"
}


Responses:
200 OK
json
Copy code
{
  "msg": "Password reset successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Invalid token or password"
}


3. Card Routes
3.1 Create Card
Endpoint: POST /cards/:levelId
Description: Create a new card.
Params: levelId (Level ID)
Request Body:
json
Copy code
{
  "cardName": "string",
  "cardDescription": "string",
  "question": "string",
  "answer": "string"
}


Responses:
201 Created
json
Copy code
{
  "msg": "Card created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


3.2 Get All Cards
Endpoint: GET /cards
Description: Get all cards.
Responses:
200 OK
json
Copy code
[
  {
    "level": "ObjectId",
    "cardName": "string",
    "cardDescription": "string",
    "question": "string",
    "answer": "string"
  }
]


3.3 Get Card
Endpoint: GET /cards/:cardId
Description: Get details of a specific card.
Params: cardId (Card ID)
Responses:
200 OK
json
Copy code
{
  "level": "ObjectId",
  "cardName": "string",
  "cardDescription": "string",
  "question": "string",
  "answer": "string"
}


404 Not Found
json
Copy code
{
  "msg": "Card not found"
}


4. Category Routes
4.1 Create Category
Endpoint: POST /categorys
Description: Create a new category.
Request Body:
json
Copy code
{
  "categoryName": "string",
  "subCategories": ["ObjectId"],
  "level": ["ObjectId"]
}


Responses:
201 Created
json
Copy code
{
  "msg": "Category created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


4.2 Get All Categories
Endpoint: GET /categorys/getAllCategory
Description: Get all categories.
Responses:
200 OK
json
Copy code
[
  {
    "categoryName": "string",
    "subCategories": ["ObjectId"],
    "level": ["ObjectId"]
  }
]


4.3 Get One Category
Endpoint: GET /categorys/:id
Description: Get details of a specific category.
Params: id (Category ID)
Responses:
200 OK
json
Copy code
{
  "categoryName": "string",
  "subCategories": ["ObjectId"],
  "level": ["ObjectId"]
}


404 Not Found
json
Copy code
{
  "msg": "Category not found"
}


5. Level Routes
5.1 Create Level
Endpoint: POST /levels/:categoryId/:subcategoryId
Description: Create a new level.
Params: categoryId (Category ID), subcategoryId (Subcategory ID)
Request Body:
json
Copy code
{
  "levelname": "string"
}


Responses:
201 Created
json
Copy code
{
  "msg": "Level created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


5.2 Get All Levels
Endpoint: GET /levels
Description: Get all levels.
Responses:
200 OK
json
Copy code
[
  {
    "levelname": "string",
    "category": "ObjectId",
    "Subcategory": "ObjectId",
    "cards": ["ObjectId"]
  }
]


5.3 Get Level
Endpoint: GET /levels/:id
Description: Get details of a specific level.
Params: id (Level ID)
Responses:
200 OK
json
Copy code
{
  "levelname": "string",
  "category": "ObjectId",
  "Subcategory": "ObjectId",
  "cards": ["ObjectId"]
}


404 Not Found
json
Copy code
{
  "msg": "Level not found"
}


6. Subcategory Routes
6.1 Create Subcategory
Endpoint: POST /subcategories/:categoryId
Description: Create a new subcategory.
Params: categoryId (Category ID)
Request Body:
json
Copy code
{
  "subcategoryname": "string"
}


Responses:
201 Created
json
Copy code
{
  "msg": "Subcategory created successfully"
}


400 Bad Request
json
Copy code
{
  "msg": "Validation error message"
}


6.2 Get All Subcategories
Endpoint: GET /subcategories
Description: Get all subcategories.
Responses:
200 OK
json
Copy code
[
  {
    "subcategoryname": "string",
    "category": "ObjectId",
    "level": ["ObjectId"]
  }
]


6.3 Get One Subcategory
Endpoint: GET /subcategories/:id
Description: Get details of a specific subcategory.
Params: id (Subcategory ID)
Responses:
200 OK
json
Copy code
{
  "subcategoryname": "string",
  "category": "ObjectId",
  "level": ["ObjectId"]
}


404 Not Found
json
Copy code
{
  "msg": "Subcategory not found"
}


7. Error Handling
7.1 Not Found
Endpoint: *
Description: Handle non-existent routes.
Response:
404 Not Found
json
Copy code
{
  "msg": "Route does not exist"
}


7.2 Error Handler
Endpoint: *
Description: General error handler for the application.
Response:
500 Internal Server Error
json
Copy code
{
  "msg": "Something went wrong, try again later"
}


8. Middleware
8.1 Admin Authentication
Description: Middleware to authenticate admin using JWT.
8.2 User Authentication
Description: Middleware to authenticate user using JWT.

