-- Cписок всех категорий
SELECT
  id AS "ID",
  title AS "Жанр"
FROM categories;

-- Список категорий для которых создано минимум одно объявление
SELECT
  id AS "ID",
  title AS "Жанр"
FROM categories
RIGHT JOIN offers_categories
  ON categories.id = offers_categories.category_id
GROUP BY id
ORDER BY id;

-- Список категорий с количеством объявлений
SELECT
  id AS "ID",
  title AS "Жанр",
  count(id) AS "Количество объявлений"
FROM categories
RIGHT JOIN offers_categories
  ON categories.id = offers_categories.category_id
GROUP BY id
ORDER BY count(id) DESC;

-- Список объявлений (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя автора, контактный email, количество комментариев, наименование категорий). Сначала свежие объявления
SELECT
  offers.id AS "ID",
  offers.title AS "Заголовок",
  offers.sum AS "Цена",
  offers."type" AS "Тип",
  offers.description AS "Описание",
  offers.created_date AS "Дата создания",
  users.name AS "Имя",
  users.email AS "Email",
  count(comments) AS "Количество комментариев",
  aggr_categories.str_categories as "Жанры"
FROM offers
LEFT JOIN users
  ON offers.user_id = users.id
LEFT JOIN "comments"
  ON comments.offer_id = offers.id
LEFT JOIN
(
  SELECT
    offers.id AS offer_id,
    string_agg(categories.title, ', ') AS str_categories
  FROM offers_categories
  LEFT JOIN offers
    ON offers_categories.offer_id = offers.id
  LEFT JOIN categories
    ON offers_categories.category_id = categories.id
  GROUP BY offers.id
  ORDER BY offers.id
) aggr_categories
  ON offers.id = aggr_categories.offer_id
GROUP BY offers.id, users.name, users.email, aggr_categories.str_categories
ORDER BY offers.id;

-- Полная информация определённого объявления (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя автора, контактный email, количество комментариев, наименование категорий)
SELECT
  offers.id AS "ID",
  offers.title AS "Заголовок",
  offers.sum AS "Цена",
  offers."type" AS "Тип",
  offers.description AS "Описание",
  offers.created_date AS "Дата создания",
  users.name AS "Имя",
  users.email AS "Email",
  count(comments) AS "Количество комментариев",
  aggr_categories.str_categories as "Жанры"
FROM offers
LEFT JOIN users
  ON offers.user_id = users.id
LEFT JOIN "comments"
  ON comments.offer_id = offers.id
LEFT JOIN
(
  SELECT
    offers.id AS offer_id,
    string_agg(categories.title, ', ') AS str_categories
  FROM offers_categories
  LEFT JOIN offers
    ON offers_categories.offer_id = offers.id
  LEFT JOIN categories
    ON offers_categories.category_id = categories.id
  WHERE offers.id = 4
  GROUP BY offers.id
) aggr_categories
  ON offers.id = aggr_categories.offer_id
WHERE offers.id = 4
GROUP BY offers.id, users.name, users.email, aggr_categories.str_categories;

-- Список из 5 свежих комментариев (идентификатор комментария, идентификатор объявления, имя автора, текст комментария)
SELECT
	comments.id as "ID Комментария",
	offers.id AS "ID Объявления",
	users.name AS "Имя",
	comments."text" AS "Текст комментария"
FROM "comments"
LEFT JOIN offers
  ON comments.offer_id = offers.id
LEFT JOIN users
  ON comments.user_id = users.id
GROUP BY comments.id, offers.id, users.name
ORDER BY comments.created_date DESC
LIMIT 5;

-- Список комментариев для определённого объявления (идентификатор комментария, идентификатор объявления, имя автора, текст комментария). Сначала новые комментарии
SELECT
	comments.id as "ID Комментария",
	offers.id AS "ID Объявления",
	users.name AS "Имя",
	comments."text" as "Текст комментария"
FROM offers
LEFT JOIN "comments"
  ON offers.id = comments.offer_id
LEFT JOIN users
  ON offers.user_id = users.id
WHERE offers.id = 2
GROUP BY offers.id, comments.id, users.name
ORDER BY comments.created_date DESC;

-- 2 объявления, соответствующих типу «куплю»
SELECT
	id AS "ID Объявления",
	title AS "Заголовок"
FROM offers
WHERE type = 'buy'
GROUP BY offers.id
LIMIT 2;

-- Обновить заголовок определённого объявления на «Уникальное предложение!»
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 2;
