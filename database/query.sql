DROP TABLE IF EXISTS public."productList";
DROP TABLE IF EXISTS public."users";

CREATE TABLE public."productList" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO public."productList" (name, image, description, difficulty, price) VALUES
('Product 1', 'menu-item-1.png', 'Description for product 1', 'Easy', 10.00),
('Product 2', 'menu-item-2.png', 'Description for product 2', 'Medium', 20.00),
('Product 3', 'menu-item-3.png', 'Description for product 3', 'Hard', 30.00),
('Product 4', 'menu-item-4.png', 'Description for product 4', 'Easy', 40.00),
('Product 5', 'menu-item-5.png', 'Description for product 5', 'Medium', 50.00),
('Product 6', 'menu-item-6.png', 'Description for product 6', 'Hard', 60.00);

CREATE TABLE public."users" (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '3541871.png',
    isactive BOOLEAN DEFAULT TRUE, -- Set default to TRUE since activation is not needed
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS public."orders";

CREATE TABLE public."orders" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES public."users"(id)
);
INSERT INTO public."orders" (user_id, product_id, quantity, price, location) VALUES
(1, 1, 2, 20.00, 'New York'),
(1, 2, 1, 20.00, 'New York'),