# E-Commerce API

## Team Members
>- Rowel Libunao
>- Zyron Jade Fausto


## User Credentials
>### Admin
>> email: adminuser@gmail.com

>> password: adminuser123

>### Customer
>> email: janedoe@test.com

>> password: janedoe12345

## Features by Rowel Libunao
>### Initial Application Template
>### Data Model Design
>### Final Code Review
>### User Endpoints
>- Register User - POST /users
>- Login User - POST /users/login

>### Product Endpoints
>- Create Product - POST /products
>- Update Product - PUT /products/:productId
>- Archive Product - PUT /products/archive/:productId
>- Activate Product - PUT /products/activate/:productId
>- Search Product By Price - POST /products/searchByPrice

>### Cart Endpoints
>- Add to Cart - POST /carts/addToCart
>- Update Quantity - PUT /carts/updateQuantity

>### Order Endpoints
>- Get All Orders - GET /orders/all-orders
>- Get My Orders - GET /orders/my-orders


## Features by Zyron Jade Fausto
>### User Endpoints
>- Get User - GET /user/details
>- Update User as Admin - PUT /users/:userId/set-as-admin
>- Update User Password - PUT /users/update-password

>### Product Endpoints
>- Get Products - GET /products/all
>- Get Active Products - GET /products/active
>- Get Product by Id - GET /products/:productId
>- Search Product By Name - POST /products/searchByName

>### Cart Endpoints
>- Get User Cart - GET /carts
>- Remove From User Cart - PUT /carts/:productId/removeFromCart
>- Clear User Cart - PUT /carts/clearCart

>### Order Endpoints
>- Checkout Order - POST /orders/checkout


## Stretch Goals by Rowel Libunao
>### Sending Email Notification
>>- Email notification will be received one successful registration and successful password update.
>>- Note: `.env` file needs to be added for the SMTP configuration. See `.env.sample` file

>### Product Review Module
>> This module is to let user add their reviews and rating to the products they have ordered. 

>> Created a separate schema called **"productReviews"**

>### Product Review Endpoints
>- Add Product Review - POST /reviews/:productId/addProductReview 
>>- Let user add review and rating to the products they have previously ordered. There is a restriction that the user can only add review and rating to the products they have record in order collection.
>>- Note: User can add review and rating "Anonymously".

>- Update Product Review - PUT /reviews/:reviewId/updateProductReview
>>- Update a product review record

>- Delete Product Review - PUT /reviews/:reviewId/deleteProductReview
>>- Soft delete a product review record

>### Additional Product Endpoints
>- Get Product Reviews - GET /products/:productId/reviews
>>- Retrieve all product reviews for a specific product.
>- Get Product Statistics - GET /products/:productId/productStatistics
>>- Retrieve different product statistics such as
>>>- Average Rating - Calculated using the average of all ratings to the product in productReview collection
>>>- Total Reviews - Total number of product review records for the given product
>>>- Total Orders - Total number of orders that contains the given product
>>>- Total Product Earnings - Sum of all the total amount of the orders that contains the given product

>#### Additional Order Endpoint
>- Update Order Status - PUT /orders/:orderId/change-order-status
>>- Currently intended if the user wish to cancel an order

## Technologies
- Node JS
- Express JS
- MongoDB
- Mongoose
- Bcrypt
- JWT
- Nodemailer JS

### How to run application locally
- Clone the application to your local machine
- Execute below commands
```
$ npm install
$ node index.js or nodemon index.js (if you have nodemon installed locally)
```
- Access the endpoints using postman
>- Note: A postman collection is provided under postman/E-Commerce API.postman_collection.json. Import the said file in your postman.
