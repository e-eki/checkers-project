## Backend игры в шашки онлайн

NodeJS + MongoDB

Фронтенд игры находится [здесь](https://github.com/e-eki/checkers-app).

### Структура проекта:

#### front-end/public
Главная страница сайта (сервер отдает ее в ответ на все запросы, кроме запросов к api).

#### server/api
API сервера

#### server/api/auth
Роуты для регистрации/аутентификации/авторизации

#### server/api/game
Все остальные роуты

#### server/api/lib
Утилиты (для работы с БД, токенами, отправки писем на имейл и проч.)

#### server/api/schemas
Схемы для сохраняемых данных в MongoDB

#### server/api/models
Методы CRUD для каждой схемы в MongoDB

#### server/api/templates
Шаблоны html-страниц, выдаваемых на некоторые запросы

### Аутентификация на форуме
Для авторизации используется схема **Token-Based Authentication**, описанная в [статье](https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc).







