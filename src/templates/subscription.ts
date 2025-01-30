import { SubscriptionConfig } from "@/server";
import { Subscription } from "../payload-types";

export function renderSubscriptionTemplate(
  subscription: SubscriptionConfig,
): string {
  const currentTimestamp = Date.now() / 1000;
  const expireTimestamp = subscription.expire
    ? new Date(subscription.expire).getTime() / 1000
    : null;
  const remainingDays = expireTimestamp
    ? Math.floor((expireTimestamp - currentTimestamp) / (24 * 3600))
    : null;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <title>Информация о подписке</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/gh/TaraRostami/qrious2/dist/qrious2.min.js"></script>
    <style>
        :root {
            --primary-color: #007bff;
            --primary-hover: #0056b3;
            --success-color: #4CAF50;
            --warning-color: #FF9800;
            --disabled-color: #9E9E9E;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --border-radius: 8px;
            --container-padding: clamp(16px, 4vw, 24px);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .container {
            width: min(100% - 16px, 600px);
            margin-inline: auto;
            margin-block: 16px;
            background-color: #fff;
            padding: var(--container-padding);
            box-shadow: 0 2px 12px var(--shadow-color);
            border-radius: var(--border-radius);
        }

        h1 {
            font-size: clamp(1.25rem, 4vw, 2rem);
            margin-bottom: 1.25rem;
        }

        h2 {
            font-size: clamp(1.125rem, 3.5vw, 1.5rem);
            margin-bottom: 1rem;
        }

        p {
            margin-bottom: 0.75rem;
            font-size: clamp(0.875rem, 3vw, 1rem);
        }

        .status {
            display: inline-flex;
            align-items: center;
            padding: 0.375rem 0.75rem;
            border-radius: calc(var(--border-radius) / 2);
            font-weight: 600;
            font-size: 0.875rem;
        }

        .active { background-color: var(--success-color); color: #fff; }
        .expired { background-color: var(--warning-color); color: #fff; }
        .disabled { background-color: var(--disabled-color); color: #fff; }

        .links-container {
            margin-top: 1.5rem;
        }

        .links-container ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .link-item {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .link-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        .subscription-name {
            font-weight: 500;
            color: #555;
            font-size: 0.875rem;
        }

        .link-row {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        .link-input {
            width: 100%;
            padding: 0.75rem;
            font-size: 0.875rem;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            background: #f8f9fa;
            color: #333;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .link-input:hover {
            background: #fff;
            border-color: var(--primary-color);
        }

        .buttons-group {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
            background-color: var(--primary-color);
            color: #fff;
            min-width: 44px;
        }

        .btn:hover {
            background-color: var(--primary-hover);
        }

        @media (min-width: 640px) {
            .container {
                width: min(100% - 32px, 600px);
                margin-block: 32px;
            }

            .link-item {
                flex-direction: row;
                align-items: flex-start;
            }

            .subscription-name {
                min-width: 150px;
                padding-top: 0.75rem;
            }

            .link-row {
                flex-direction: row;
                align-items: center;
            }

            .buttons-group {
                flex: 0 0 auto;
            }

            .btn {
                min-width: 100px;
            }
        }

        .qr-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            place-items: center;
            padding: 1rem;
            backdrop-filter: blur(4px);
            z-index: 1000;
        }

        .qr-content {
            background: #fff;
            padding: 2rem;
            border-radius: var(--border-radius);
            position: relative;
            max-width: 90vw;
            width: max-content;
        }

        .qr-close {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem;
            line-height: 1;
            color: #666;
        }

        .qr-close:hover {
            color: #000;
        }

        .announce {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #fff3cd;
            border-radius: var(--border-radius);
            border-left: 4px solid var(--warning-color);
        }

        #qrCode {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 256px;
            min-width: 256px;
        }

        #qrCode img {
            max-width: 100%;
            height: auto;
        }

        #qrCanvas {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${subscription.vpn_name || "Информация о подписке"}</h1>
        <p>Статус: <span class="status ${expireTimestamp && expireTimestamp < currentTimestamp ? "expired" : "active"}">${
          expireTimestamp && expireTimestamp < currentTimestamp
            ? "Истекла"
            : "Активна"
        }</span></p>

        <p>Дата окончания: ${
          expireTimestamp
            ? `${new Date(expireTimestamp * 1000).toLocaleString("ru-RU")} (осталось ${remainingDays} дней)`
            : "∞"
        }</p>

        ${
          subscription.announce
            ? `<div class="announce">${subscription.announce}</div>`
            : ""
        }

        <div class="links-container">
            <h2>Ссылки:</h2>
            <ul>
                ${subscription.links
                  .map(
                    (link) => `
                    <li class="link-item">
                        <div class="subscription-name">${link.url.split("#")[1] || ""}</div>
                        <div class="link-content">
                            <div class="link-row">
                                <input type="text" class="link-input" value="${link.url}" readonly />
                                <div class="buttons-group">
                                    <button class="btn copy-btn" data-link="${link.url}">Копировать</button>
                                    <button class="btn qr-btn" data-link="${link.url}">QR</button>
                                </div>
                            </div>
                        </div>
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    </div>

    <div class="qr-modal" id="qrModal">
        <div class="qr-content">
            <button class="qr-close" aria-label="Закрыть">&times;</button>
            <div id="qrCode"></div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const copyBtns = document.querySelectorAll('.copy-btn');
            const qrBtns = document.querySelectorAll('.qr-btn');
            const qrModal = document.getElementById('qrModal');
            const qrClose = qrModal.querySelector('.qr-close');
            const qrCode = document.getElementById('qrCode');

            // Копирование ссылки
            copyBtns.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const link = btn.dataset.link;
                    try {
                        await navigator.clipboard.writeText(link);
                        btn.textContent = 'Скопировано!';
                        setTimeout(() => btn.textContent = 'Копировать', 1500);
                    } catch (err) {
                        // Fallback для старых браузеров
                        const input = document.createElement('input');
                        input.value = link;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                        btn.textContent = 'Скопировано!';
                        setTimeout(() => btn.textContent = 'Копировать', 1500);
                    }
                });
            });

            // Генерация QR кода
            qrBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const link = btn.dataset.link;
                    
                    // Очищаем предыдущий QR код и создаем новый canvas
                    qrCode.innerHTML = '<canvas id="qrCanvas"></canvas>';
                    
                    try {
                        // Создаем новый QR код с расширенными настройками
                        const qr = new QRious({
                            element: document.getElementById('qrCanvas'),
                            value: link.split('#')[0] + '#' + encodeURIComponent(link.split('#')[1]),
                            size: 400,
                            background: 'white',
                            backgroundAlpha: 0,
                            foreground: 'black',
                            padding: 2,
                            level: 'L'
                        });
                    } catch (e) {
                        console.error('Failed to generate QR code:', e);
                        qrCode.innerHTML = '<p style="color: red; text-align: center;">Ошибка генерации QR кода</p>';
                        return;
                    }

                    qrModal.style.display = 'grid';
                });
            });

            // Закрытие модального окна
            qrClose.addEventListener('click', () => {
                qrModal.style.display = 'none';
            });

            qrModal.addEventListener('click', (e) => {
                if (e.target === qrModal) {
                    qrModal.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>`;
}
