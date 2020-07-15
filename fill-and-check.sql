/* There are INSERTs*/
INSERT INTO users VALUES
(1, 'Стивен', 'Кинг', 'a@gmail.com', 'qwertyss', 'image.jpg'),
(2, 'Сергей', 'Лукьяненко', 'b@gmail.com', 'qwertyss', 'image.jpg'),
(3, 'Джон', 'Резиг', 'c@gmail.com', 'qwertyss', 'image.jpg'),
(4, 'Артур Конан', 'Дойл', 'd@gmail.com', 'qwertyss', 'image.jpg'),
(5, 'Говард Филлипс', 'Лавкрафт', 'e@gmail.com', 'qwertyss', 'image.jpg'),
(6, 'Антон', 'Чехов', 'f@gmail.com', 'qwertyss', 'image.jpg'),
(7, 'Джанет', 'Азимов', 'g@gmail.com', 'qwertyss', 'image.jpg'),
(8, 'Айзек', 'Азимов', 'h@gmail.com', 'qwertyss', 'image.jpg'),
(9, 'Курт', 'Занднер', 'i@gmail.com', 'qwertyss', 'image.jpg'),
(10, 'Питер', 'Уоттс', 'j@gmail.com', 'qwertyss', 'image.jpg'),
(11, 'Роберт', 'Сойер', 'k@gmail.com', 'qwertyss', 'image.jpg'),
(12, 'Мишель', 'Верн', 'l@gmail.com', 'qwertyss', 'image.jpg');

INSERT INTO offers VALUES
(1, 'offer', 'Оно', 'Даже не знаю что сказать', 55, 'picture.png', '1986-01-01', 1),
(2, 'buy', 'Кладбище домашних животных', 'Даже не знаю что сказать', 55, 'picture.png', '1983-11-13', 3),
(3, 'offer', 'Под куполом', 'Даже не знаю что сказать', 55, 'picture.png', '2009-01-01', 5),
(4, 'buy', '11/22/63', 'Даже не знаю что сказать', 55, 'picture.png', '2011-11-08', 7),
(5, 'offer', 'Зелёная миля', 'Даже не знаю что сказать', 55, 'picture.png', '1996-01-01', 2),
(6, 'buy', 'Доктор сон', 'Даже не знаю что сказать', 55, 'picture.png', '2013-01-01', 8),
(7, 'buy', 'Чужак', 'Даже не знаю что сказать', 55, 'picture.png', '2018-01-01', 9),
(8, 'offer', 'Институт', 'Даже не знаю что сказать', 55, 'picture.png', '2019-09-01', 11),
(9, 'buy', 'Ночной дозор', 'Даже не знаю что сказать', 55, 'picture.png', '1998-01-01', 12),
(10, 'offer', 'Дневной дозор', 'Даже не знаю что сказать', 55, 'picture.png', '2000-01-01', 3),
(11, 'buy', 'Сумеречный дозор', 'Даже не знаю что сказать', 55, 'picture.png', '2003-01-01', 6),
(12, 'offer', 'Последний дозор', 'Даже не знаю что сказать', 55, 'picture.png', '2005-01-01', 2);

INSERT INTO categories VALUES
(1, 'Фантастика', 'picture.png'),
(2, 'Ужасы', 'picture.png'),
(3, 'Драма', 'picture.png'),
(4, 'Трагедия', 'picture.png'),
(5, 'Комедия', 'picture.png'),
(6, 'Роман', 'picture.png'),
(7, 'IT', 'picture.png');

INSERT INTO comments VALUES
(1, 'Даже не знаю что сказать', '1986-01-01', 1, 12),
(2, 'Даже не знаю что сказать', '1987-01-01', 3, 1),
(3, 'Даже не знаю что сказать', '1988-01-01', 7, 3),
(4, 'Даже не знаю что сказать', '1983-01-01', 12, 6),
(5, 'Даже не знаю что сказать', '1981-01-01', 2, 10),
(6, 'Даже не знаю что сказать', '1984-01-01', 4, 11),
(7, 'Даже не знаю что сказать', '1980-01-01', 1, 2),
(8, 'Даже не знаю что сказать', '1985-01-01', 2, 8),
(9, 'Даже не знаю что сказать', '1982-01-01', 9, 1),
(10, 'Даже не знаю что сказать', '1989-01-01', 10, 7);

INSERT INTO offers_categories VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(12, 2),
(1, 3),
(11, 1),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
(8, 3),
(7, 4),
(2, 5),
(4, 5),
(9, 6),
(3, 7),
(8, 7),
(12, 7);

/* There are SELECTs for checking*/
SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	offers.title AS "Объявление",
  offers.sum AS "Цена",
  offers.created_date AS "Дата"
FROM offers
INNER JOIN users
	ON offers.user_id = users.id;

SELECT
  users.first_name AS "Имя",
	users.last_name AS "Фамилия",
	offers.title AS "Объявление",
  comments.text AS "Комментарий"
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
INNER JOIN offers
	ON comments.offer_id = offers.id;

SELECT
	offers.title AS "Объявление",
	string_agg(categories.title, ', ') AS "Жанры"
FROM offers_categories
LEFT JOIN offers
	ON offers_categories.offer_id = offers.id
LEFT JOIN categories
	ON offers_categories.category_id = categories.id
GROUP BY offers.title;
