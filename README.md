
# Ticketing App

A Microservices Application that allows users to sell and buy tickets.

The App contains 5 services [ Auth, Tickets, Orders, Payments, Expiration]

Technologies Used: Node.js - Express.js - TypeScript - MongoDB - Mongoose - Redis - Kafka - Docker - Kubernetes - Skaffold.

## Business Rules
Users can list a ticket for an event (concert, movie) for sale.

Other Users can purchase this ticket.

Any user can list tickets for sale and purchase tickets

When a user attempts to purchase a ticket, the ticket is locked for 15 minutes. The user has 15 minutes to enter their payment info.

While locked, no other user can purchase the ticket. After 15 mintues, the ticket should unlock.

Ticket prices can be edited if they're not locked.

## Features
- Use Docker to Build & Push the Micro-Services' Images.
- Use Kubernetes to Orchasterate the Micro-Services' Containers, Deployments, Pods & Network Services.
- Use Skaffold to Manage Images Builds and Watch for Code/File Changes.
- Authenticate Users with JWT & Cookies.
- Use OAuth2 to Handle Users Signup & Signin with (Google / Facebook) Accounts.
- Build a Common Module as an NPM Module to Organize and Enhance the Reusability of Code between Services.
- Use OOP Principles to Build Exceptions & Events Hierarchy.
- Guarantee Consistently Structured Responses from the Different API's.
- Unit Testing with Jest, Following a Test-First Approach.
- Use Kafka to Create an Event-Based Architecture between Services.
- Enforce Structure Constraints on Events Shared across Services.
- Handle Credit-Card Payments using Stripe API.
- Use Redis to Cache Payments Expiration Dates.
- Build CI/CD Pipelines using Github Actions.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Ahmed-Yassen/ticketing.git
```

Go to the project directory

```bash
  cd ticketing
```

Run skaffold (Make sure Docker & Kubernetes are Up)

```bash
  skaffold dev
```

## API Documentation

### **-- Auth Service --**

#### Signup

```http
  POST /api/users/signup/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstName` | `string` | **Required**.  |
| `lastName` | `string` | **Required**.  |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. should be between 8 & 20 characters. |

#### Signin
  ##### Signin with Email & Password
```http
  POST /api/users/signin
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**. |

##### Signin with Google
```http
  GET /api/users/google
```
##### Signin with Facebook
```http
  GET /api/users/facebook
```

#### Signout (*Requires Auth*)

```http
  POST /api/users/signout
```
#### Get Current-User (*Requires Auth*)

```http
  GET /api/users/currentuser
```
### **-- Tickets Service --**

#### Create a ticket (*Requires Auth*)

```http
  POST /api/tickets/create  
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**.|
| `price` | `number` | **Required**. should be >1|

#### Update a Ticket (*Requires Auth*)

```http
  PUT /api/tickets/update/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `MongoId` | **Required**.  Ticket ID|
| `title` | `string` | **Optional**.|
| `price` | `number` | **Optional**.|

#### Get all Tickets
```http
  GET /api/tickets
```

#### Get Ticket by Id
```http
  GET /api/tickets/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `MongoId` | **Required**.  Ticket ID|

### **-- Orders Service --** (*Requires Auth*)

#### Create an Order 
```http
  POST /api/orders
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ticketId` | `MongoId` | **Required**.  Ticket ID|

#### Get My Orders 
```http
  GET /api/orders
```

#### Get an Order by Id
```http
  GET /api/orders/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `MongoId` | **Required**.  |


#### Cancel an Order
```http
  PATCH /api/orders/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `number` | **Required**.  |

### **-- Payments Service --** (*Requires Auth*)

#### Charge User
```http
  POST /api/payments/charge
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token` | `string` | **Required**. Stripe Token  |
| `orderId` | `MongoId` | **Required**.  |


## Feedback

If you have any feedback, please reach out to me at ahmed.ibrahim.yassen@gmail.com
