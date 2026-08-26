const SUPABASE_URL = 'https://rbuomhtioblkukgwbumj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Wx-vd3wcXLx0uaeutArrqA_fpBmduTp';

const CONFIG = {
    EVENT_DATE: '2026-09-09T17:00:00+05:00',
    MAP_URL: 'https://go.2gis.com/uwkw6',
    AUTO_SCROLL_ENABLED: true
};

const select = (selector) => document.querySelector(selector);

function createCalendar() {
    const calendar = select('#calendar-days');
    const firstDay = new Date(2026, 8, 1).getDay();
    const offset = (firstDay + 6) % 7;

    for (let index = 0; index < offset; index += 1) {
        calendar.append(document.createElement('span'));
    }

    for (let day = 1; day <= 30; day += 1) {
        const cell = document.createElement('span');
        cell.textContent = day;
        if (day === 9) {
            cell.className = 'selected';
            cell.setAttribute('aria-label', '9 қыркүйек — той күні');
        }
        calendar.append(cell);
    }
}

function updateCountdown() {
    const difference = new Date(CONFIG.EVENT_DATE).getTime() - Date.now();
    const ids = ['days', 'hours', 'minutes', 'seconds'];

    if (difference <= 0) {
        ids.forEach((id) => { select(`#${id}`).textContent = '00'; });
        select('#countdown-message').textContent = 'Тойымыз басталды!';
        return;
    }

    const values = [
        Math.floor(difference / 86400000),
        Math.floor(difference / 3600000) % 24,
        Math.floor(difference / 60000) % 60,
        Math.floor(difference / 1000) % 60
    ];
    ids.forEach((id, index) => {
        select(`#${id}`).textContent = String(values[index]).padStart(2, '0');
    });
}

function setupMusic() {
    const audio = select('#music');
    const button = select('#music-toggle');
    const sync = () => {
        const isPlaying = !audio.paused;
        button.textContent = isPlaying ? 'Ⅱ' : '♫';
        button.setAttribute('aria-label', isPlaying ? 'Музыканы өшіру' : 'Музыканы қосу');
    };
    const play = () => audio.play().catch(() => undefined);

    button.addEventListener('click', () => (audio.paused ? play() : audio.pause()));
    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    audio.addEventListener('error', sync);
    window.addEventListener('load', play, { once: true });
    ['click', 'touchstart', 'scroll', 'keydown'].forEach((event) => {
        window.addEventListener(event, play, { once: true, passive: event !== 'keydown' });
    });
    sync();
}

function setupAutoScroll() {
    if (!CONFIG.AUTO_SCROLL_ENABLED || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let stopped = false;
    let frame;
    let start;
    const stop = () => {
        stopped = true;
        cancelAnimationFrame(frame);
    };

    ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach((event) => {
        window.addEventListener(event, stop, { once: true, passive: true });
    });

    setTimeout(() => {
        if (stopped || window.scrollY > 5) return;
        start = performance.now();
        const move = (now) => {
            if (stopped) return;
            window.scrollTo(0, (now - start) * 0.018);
            frame = requestAnimationFrame(move);
        };
        frame = requestAnimationFrame(move);
    }, 1800);
}

function setupForm() {
    const form = select('#rsvp-form');
    const message = select('#form-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const button = form.querySelector('button');
        const formData = new FormData(form);
        const payload = {
            name: String(formData.get('name')).trim(),
            additional: String(formData.get('additional') || '').trim(),
            answer: String(formData.get('answer'))
        };

        button.disabled = true;
        message.textContent = '';

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rsvp`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Supabase request failed');
            message.textContent = 'Рақмет! Жауабыңыз қабылданды.';
            form.reset();
        } catch {
            message.textContent = 'Жіберу кезінде қате пайда болды.';
        } finally {
            button.disabled = false;
        }
    });
}

createCalendar();
updateCountdown();
setInterval(updateCountdown, 1000);
select('#map-route-link').href = CONFIG.MAP_URL;

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    }
}), { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
setupMusic();
setupAutoScroll();
setupForm();