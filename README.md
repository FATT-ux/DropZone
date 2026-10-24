# DropZone 

Маркетплейс одежды и обуви (Poizon, Taobao, Grailed и др.).

## Технологии
- **Frontend:** Next.js (App Router), React, TypeScript, CSS Modules
- **Backend:** Node.js, Express, PostgreSQL
- **Auth:** JWT (JSON Web Tokens), bcrypt
- **API:** REST

##  Функционал
-  Регистрация и авторизация (JWT)
-  Список магазинов и товаров
-  Живой поиск с выпадающим списком
-  Фильтрация по типу (Обувь, Одежда, Аксессуары)
-  Пагинация (12 товаров на страницу)
-  Избранное (с глобальным счётчиком)
-  Корзина (с подсчётом суммы и удалением)
-  Профиль пользователя
-  Страница товара с характеристиками

##  Установка и запуск

### Backend
1. Перейди в папку `backend`
2. Установи зависимости: `npm install`
3. Запусти: `node server.js`

### Frontend
1. Перейди в папку `my-app`
2. Установи зависимости: `npm install`
3. Запусти: `npm run dev`
4. Открой [http://localhost:3000](http://localhost:3000)

##  Скриншоты

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/826551df-d5d7-45e2-8bbd-fdafccca5173" alt="Главная страница" width="100%" style="border-radius: 8px;" />
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/53ac8094-72fc-4f98-af07-533ca98b93aa" alt="Страница товара" width="100%" style="border-radius: 8px;" />
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/9919d108-8ff7-4546-9cb5-ce919db9df07" alt="Корзина / Профиль" width="80%" style="border-radius: 8px;" />
    </td>
  </tr>
</table>
