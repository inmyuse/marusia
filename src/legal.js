// Text of the /terms and /privacy pages. Each section: { h, p: [paragraphs] | ul: [items] }
export const legal = {
  ru: {
    back: 'На главную',
    updated: 'Обновлено: 19 октября 2026',
    terms: {
      title: 'Условия использования',
      lead: 'Проект Маруся открыт: исходный код можно читать, изменять и распространять. Но использовать его в коммерческих целях нельзя.',
      sections: [
        {
          h: 'Лицензия',
          p: [
            'Проект распространяется по лицензии Marusia Non-Commercial License v1.0 (см. файл LICENSE в репозитории). Коротко: открыто для всех, кроме коммерческого использования.',
          ],
        },
        {
          h: 'Что можно',
          ul: [
            'Смотреть и изучать исходный код.',
            'Запускать колонку и сайт для личных, учебных и исследовательских целей.',
            'Изменять код и делиться своими версиями без прибыли.',
            'Использовать в некоммерческих проектах и сообществах при условии указания авторства (redjex) и сохранения текста лицензии.',
          ],
        },
        {
          h: 'Что нельзя',
          ul: [
            'Продавать проект, его части или устройства на его основе.',
            'Включать код в платные продукты и подписки, а также в сервисы, приносящие доход (в том числе от рекламы).',
            'Использовать проект внутри компании для получения прибыли.',
            'Убирать указание авторства и текст лицензии.',
          ],
        },
        {
          h: 'Производные версии',
          p: ['Изменённые версии должны распространяться на тех же условиях: открыто и только для некоммерческого использования.'],
        },
        {
          h: 'Коммерческое использование',
          p: ['Если нужна коммерческая лицензия, необходимо получить письменное разрешение автора до начала использования.'],
        },
        {
          h: 'Отказ от гарантий',
          p: ['Проект предоставляется «как есть», без каких-либо гарантий. Автор не отвечает за ущерб, возникший из-за использования проекта.'],
        },
      ],
    },
    privacy: {
      title: 'Политика конфиденциальности',
      lead: 'Маруся не следит за вами. Все вычисления происходят локально на вашем устройстве.',
      sections: [
        {
          h: 'Какие данные мы собираем',
          p: ['Никакие. На сайте нет аккаунтов, форм, аналитики, рекламных трекеров и cookie.'],
        },
        {
          h: 'Локальная обработка',
          p: ['Работа колонки и интерфейса не требует отправки ваших данных на сервер: вычисления выполняются локально.'],
        },
        {
          h: 'Сторонние ресурсы',
          p: [
            'Шрифты загружаются с Google Fonts. При их загрузке ваш браузер обращается к серверам Google, и они могут получить ваш IP-адрес. Мы не получаем эти данные.',
          ],
        },
        {
          h: 'Настройки',
          p: ['Выбранные язык и тема не сохраняются и не передаются никуда.'],
        },
        {
          h: 'Изменения',
          p: ['Если политика изменится, новая версия появится на этой странице с обновлённой датой.'],
        },
      ],
    },
  },
  en: {
    back: 'Back to home',
    updated: 'Updated: October 19, 2026',
    terms: {
      title: 'Terms of Service',
      lead: 'Marusia is open: you can read, modify and share the source code. You may not use it for commercial purposes.',
      sections: [
        {
          h: 'License',
          p: [
            'The project is distributed under the Marusia Non-Commercial License v1.0 (see the LICENSE file in the repository). In short: open to everyone, except for commercial use.',
          ],
        },
        {
          h: 'What you can do',
          ul: [
            'Read and study the source code.',
            'Run the speaker and the website for personal, educational and research purposes.',
            'Modify the code and share your versions without profit.',
            'Use it in non-commercial projects and communities, as long as you credit the author (Ivan, redjex) and keep the license text.',
          ],
        },
        {
          h: 'What you cannot do',
          ul: [
            'Sell the project, its parts, or devices built on it.',
            'Include the code in paid products or subscriptions, or in services that earn revenue (including from ads).',
            'Use the project inside a company to make a profit.',
            'Remove the attribution or the license text.',
          ],
        },
        {
          h: 'Derivative works',
          p: ['Modified versions must be distributed under the same terms: open and for non-commercial use only.'],
        },
        {
          h: 'Commercial use',
          p: ['If you need a commercial license, get written permission from the author before you start using the project.'],
        },
        {
          h: 'Disclaimer',
          p: ['The project is provided "as is", without warranty of any kind. The author is not liable for any damage caused by its use.'],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      lead: 'Marusia does not track you. All computations happen locally on your device.',
      sections: [
        {
          h: 'What data we collect',
          p: ['None. The site has no accounts, forms, analytics, ad trackers or cookies.'],
        },
        {
          h: 'Local processing',
          p: ['The speaker and the interface do not need to send your data to a server: computations run locally.'],
        },
        {
          h: 'Third-party resources',
          p: [
            'Fonts are loaded from Google Fonts. When they load, your browser contacts Google servers, which may receive your IP address. We do not receive this data.',
          ],
        },
        {
          h: 'Settings',
          p: ['The language and theme you pick are not stored or sent anywhere.'],
        },
        {
          h: 'Changes',
          p: ['If this policy changes, the new version will appear on this page with an updated date.'],
        },
      ],
    },
  },
};
