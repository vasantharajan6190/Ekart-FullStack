CREATE DATABASE ekart;

CREATE TABLE users(
    user_id serial NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    mobile_no VARCHAR(10) NOT NULL,
    PRIMARY KEY (user_id)
);
//sample Users
INSERT INTO users(name,email,password,mobile_no) values('Vasanth','mahaperiyavar100@gmail.com','Password123','9677861286');
INSERT INTO users(name,email,password,mobile_no) values('Karthi','rajubhai6190@gmail.com','pass','9003441975');


CREATE TABLE items(
    items_id SERIAL NOT NULL,
    user_id SERIAL,
    title VARCHAR(200) NOT NULL UNIQUE,
    img VARCHAR(1000) NOT NULL,
    price VARCHAR(200) NOT null,
    rating VARCHAR(200) NOT NULL,
    favback BOOLEAN DEFAULT false,
    cartback BOOLEAN DEFAULT false,
    PRIMARY KEY (items_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
 
//sample items
INSERT INTO items(user_id,title,img,price,rating,favback,cartback) values(18,'Mi note 8','https://download.appmifile.com/5_updatepdf_in/28/02/2019/b7c1a94f-78d8-47ca-a3aa-d6c417b62d6e.png','20000','2.5',false,false);
INSERT INTO items(user_id,title,img,price,rating,favback,cartback) values(18,'Iphone 5','https://www.gizmochina.com/wp-content/uploads/2019/09/Apple-iPhone-11-1-500x500.jpg','50000','3.5',false,false);

CREATE TABLE cart(
    cart_id SERIAL NOT NULL,
    user_id SERIAL,
    title VARCHAR(200)  NOT NULL,
    img VARCHAR(1000) NOT NULL,
    price VARCHAR(200) NOT null,
    rating VARCHAR(200) NOT NULL,
    favback BOOLEAN,
    cartback BOOLEAN,
    PRIMARY KEY (cart_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE fav(
    fav_id SERIAL NOT NULL,
    user_id SERIAL,
    title VARCHAR(200)  NOT NULL,
    img VARCHAR(1000) NOT NULL,
    price VARCHAR(200) NOT null,
    rating VARCHAR(200) NOT NULL,
     favback BOOLEAN,
    cartback BOOLEAN,
    PRIMARY KEY (fav_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);