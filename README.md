

## Checkers-project

Игра в шашки онлайн.
Back-end & front-end.
front-end не полная версия, взят из папки _**public**_ проекта _**checkers-app**_: [ссылка](https://github.com/e-eki/checkers-app/tree/g/master/public).

## Структура проекта:

* ### front-end/public:
   * icon
   * bundle.js
   * index.html

* ### http

* ### server:
   * index.js
   * config.js
   * config-init.js
   * api:
      * auth
      * lib
      * models
      * routes
      * schemas
      * templates

### front-end/public
Главная страница сайта (сервер отдает ее в ответ на все запросы, кроме запросов к api).

### front-end/public/index.html
Главный html-файл.

### front-end/public/bundle.js
Исполняемый скрипт (сборка), вызываемый из front-end/public/index.html.

### front-end/public/icon
Фавиконки.

### http
http-запросы для тестирования

### server/index.js
Файл с кодом сервера.

### server/config.js
Конфиг с константами и паролями.

### server/config-init.js
Конфиг с константами и без паролей (версия для github)

### server/api
API сервера

### server/api/auth
Роуты для регистрации/аутентификации/авторизации

### server/api/routes
Все остальные роуты.

### server/api/lib
Утилиты (для работы с БД, токенами, отправки писем на имейл и проч.)

### server/api/schemas
Схемы для сохраняемых данных в MongoDB.

### server/api/models
Методы CRUD для каждой схемы в MongoDB.

### server/api/templates
Шаблоны html-страниц, выдаваемых на некоторые запросы.

## Авторизация

Для авторизации в проекте используется схема **Token-Based Authentication**, описанная в [статье](https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc).







