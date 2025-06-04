# E-Commerce System

## Descriptions

E-Commerce website allow users to sign in, sign up. In this application, they can also view the products without having an account, but for checkout a product. Absolutely, they must be a memeber of E-Commerce system. The customers not only can view product's detail but also they can checkout products, after that step, they can follow the order status of the product that they bought. For administration, the manager works as a admin for the system which they manage the users, categories, products and customer's orders. That's the overall of our project, happy shopping!

## Implementation

E-Commerce Web Application allow users to view, buy and rate products. This application is built based on 2 differences technology.

- For back-end handling:
  - We typically used Java with JPA for backend handle - according to the final project of Java course
  - We also applied Design Pattern into our project for better maintainance in the future.

- For interfaces:
  - We used ReactJS to build interface with multiple modules supported.

- For storing data:
  - We used MongoDB - NoSQL database for storing application data

## Installation

The project includes 2 directories

```
522H0038_522H0080/
├── ecommerce-backend      # include backend implementation
├── ecommerce-frontend      # include frontend implementation
└── README.md               # this file
```

## Run the Application

First thing first, is the database. If you have MongoDB Compass on your Desktop screen, that would be easier for your. But if you don't, don't worry, I got you.

- You having MongoDB Compass: 

  - It will required you login nor something, do that things real quick.

  - On the left panel of the app, under `CONNECTIONS`, you will see an object named `database`, if you don't, create one, choose any name you love. Then click `CONNECT` on it.

  - Create a new database on your connection. THIS IS IMPORTANT, CREATE ON AND NAMED IT `ecommerce`.

  - Then you are done, move to the next path.

- You doing it on [MongoDB website](https://www.mongodb.com/): 

  - Sign in first.

  - Click on **"Build a Database"**, choose **"Shared"** tab (for free).

  - Click **"Create"** with default settings:

    - Cloud Provider: AWS (default).
  
    - Region: Singapore / Hong Kong / ...
  
    - Cluster Name: On you decision or `Cluster0`
  
  - Create database named `ecommerce` on **"Browse Collection"**, then **"Add My Own Data"**

    - **"Database name"**: `ecommerce`


For `/ecommerce-backend` your just need to run it on any Java supportive IDE such as Intelliji Idea,...

Move into `/ecommerce-frontend` then open your CLI to download the required modules for project. Run:

```bash
npm install
```

This will download the `node_modules` directory which stored the usage modules. You can not run the program without having required modules, this lead to the application running not in expectation.

Finishing download it, then run these command to start the frontend program 

```bash
npm run dev
```

The frontend program will be running on `localhost:3000` you can access through it on your web browser. 

#### Happy visting, we wish you luck and your health.

## Authors

- [nhathao512](https://github.com/nhathao512)
- 
- [giahao1411](https://github.com/giahao1411)
