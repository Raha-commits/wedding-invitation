# Нұрғиса & Бану

Лёгкое статическое приглашение на HTML, CSS и Vanilla JavaScript.

## Запуск

Откройте `index.html` напрямую в браузере или выполните `npm install`, затем `npm start`.

## Настройка

Основные параметры находятся в начале `js/script.js`: дата события, ссылка на 2GIS, endpoint RSVP и `AUTO_SCROLL_ENABLED`.

Для RSVP используется Supabase REST API. Сначала выполните SQL из `supabase/schema.sql` в Supabase SQL Editor, затем укажите URL проекта и anon key в `js/script.js` в объекте `CONFIG`. Секретный service role key во frontend добавлять нельзя.

RLS включён: публичные гости могут только отправить (`INSERT`) ответ и не могут читать, изменять или удалять записи.

Музыка подключена из `assets/audio/music.mp3`. Автовоспроизведение зависит от политики браузера.

Фотография места заменена лёгким стилизованным placeholder, чтобы не использовать случайное изображение.
