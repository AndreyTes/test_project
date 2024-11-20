
## Description

Test App

## Project setup and run

```bash
$ npm install
```

```bash
$ docker-compose up
```

Скопировать дамп в контейнер
```bash
$ docker cp test.sql postgres_db:/test.sql
```

Загрузить дамп в БД
```bash
$ cat test.sql | docker exec -i postgres_db psql -U postgres -d postgres_db
```
Проверить можно в adminer, он запущен на порту 8080

Запустить приложение
```bash
$ npm run dev
```

Синхронизировать модели(если требуется) с бд можно через:
GET/ lessons/sync

Для эндпоинта
GET /lessons?date=2019-02-01

GET /lessons/?teacherIds=1,2

GET /lessons?status=1 

GET /lessons?studentsCount=3

Фильтры можно комбинировать 
Пагинация добавлена











