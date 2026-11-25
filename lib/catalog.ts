// Каталог CRAFT: мастерские, направления и продукты.
// Источник: документ «CRAFT: продуктовая экосистема и коммерческая стратегия», разделы 5 и 6.
// Чистые данные без импортов: файл читают и страницы, и тесты в Node.
// Цен здесь нет намеренно: публичные цены утверждает владелец (AGENTS.md).

export type CatalogStatus = "open" | "preparing" | "idea";

export const statusLabel: Record<CatalogStatus, string> = {
  open: "Открыт",
  preparing: "Готовим",
  idea: "Идея",
};

export type Workshop = {
  slug: string;
  title: string;
  audience: string;
  support: string;
  next: string[];
};

export type Direction = {
  slug: string;
  workshop: string;
  title: string;
  project: string;
  entry: string;
  level: string;
  weeks: string;
  stack: string;
};

export type RouteStep = { stage: string; text: string };
export type Question = { q: string; a: string };

// Содержание страницы продукта сверх строки каталога. Поле есть только тогда,
// когда за ним стоит настоящий материал; пустые блоки на странице не рисуются.
export type ProductPage = {
  lead: string;
  forWhom: string;
  notForWhom: string;
  notForWhomSlug?: string;
  inHands: string[];
  route?: RouteStep[];
  time: string;
  needs: string;
  boundaries: string;
  done?: string[];
  help: string;
  formatsNote?: string;
  missing?: string[];
  faq: Question[];
  next: string[];
  related: string[];
};

export type Product = {
  slug: string;
  direction: string;
  title: string;
  result: string;
  entry: string;
  term: string;
  stack: string;
  status: CatalogStatus;
  page?: ProductPage;
};

export const workshops: Workshop[] = [
  {
    "slug": "sites-shops",
    "title": "Сайты и магазины",
    "audience": "Для специалистов, малого бизнеса и авторов, которым нужна витрина.",
    "support": "Напарник проверяет работу по чек-листу (доступность, скорость, формы), наставник — структуру и тексты.",
    "next": [
      "services-products",
      "growth-markets"
    ]
  },
  {
    "slug": "services-products",
    "title": "Сервисы и продукты",
    "audience": "Для авторов собственного сервиса.",
    "support": "Наставник на этапах «Проверка» и «Бизнес-модель».",
    "next": [
      "infra-security",
      "growth-markets"
    ]
  },
  {
    "slug": "code",
    "title": "Код",
    "audience": "Для тех, кто хочет писать и понимать код.",
    "support": "Напарник в режиме «Учусь», наставник — ревью кода.",
    "next": [
      "infra-security"
    ]
  },
  {
    "slug": "infra-security",
    "title": "Инфраструктура и защита",
    "audience": "Для тех, у кого уже есть проект.",
    "support": "Здесь только защитная сторона: проверка и исправление собственного проекта; всё, что касается безопасности, подтверждает человек.",
    "next": [
      "code",
      "ai-automation"
    ]
  },
  {
    "slug": "ai-automation",
    "title": "ИИ и автоматизация",
    "audience": "Для всех, кому нужно убрать рутину или встроить модель в проект.",
    "support": "Напарник и наставник; правило по данным — чужие персональные данные в модель не отправляются.",
    "next": [
      "data",
      "growth-markets"
    ]
  },
  {
    "slug": "data",
    "title": "Данные",
    "audience": "Для аналитиков и авторов, которым нужны решения на основе данных.",
    "support": "Наставник проверяет выводы и методику.",
    "next": [
      "ai-automation"
    ]
  },
  {
    "slug": "design-media",
    "title": "Дизайн и медиа",
    "audience": "Для авторов интерфейсов и контента.",
    "support": "Наставник разбирает макеты; Напарник проверяет по критериям доступности и композиции.",
    "next": [
      "sites-shops",
      "growth-markets"
    ]
  },
  {
    "slug": "growth-markets",
    "title": "Рост и новые рынки",
    "audience": "Для предпринимателей и авторов, которые хотят проверить спрос.",
    "support": "Наставник проверяет гипотезы и цифры. Блокчейн и агентная коммерция — области исследования, а не пути к доходу.",
    "next": [
      "services-products"
    ]
  }
];

export const directions: Direction[] = [
  {
    "slug": "sites",
    "workshop": "sites-shops",
    "title": "Сайты",
    "project": "Сайт-визитка или лендинг с формой заявки на своём домене",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "3–5 нед.",
    "stack": "HTML, CSS, Next.js или конструктор"
  },
  {
    "slug": "web-dev",
    "workshop": "sites-shops",
    "title": "Веб-разработка",
    "project": "Многостраничный сайт с управлением контентом",
    "entry": "базовые HTML и CSS",
    "level": "средняя",
    "weeks": "6–8 нед.",
    "stack": "TypeScript, React, Next.js, PostgreSQL"
  },
  {
    "slug": "online-shops",
    "workshop": "sites-shops",
    "title": "Интернет-магазины",
    "project": "Магазин на 20 товаров с корзиной; оплата в тестовом режиме",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "6–8 нед.",
    "stack": "Конструктор или Next.js, тестовый платёж"
  },
  {
    "slug": "ecommerce",
    "workshop": "sites-shops",
    "title": "Электронная коммерция",
    "project": "Схема продаж: каталог, карточки, воронка, аналитика",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "Площадки, таблицы, веб-аналитика"
  },
  {
    "slug": "no-code",
    "workshop": "sites-shops",
    "title": "No-code и low-code",
    "project": "Сервис без кода: форма → база → уведомление",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "2–4 нед.",
    "stack": "Конструкторы, базы данных, автоматизации"
  },
  {
    "slug": "saas",
    "workshop": "services-products",
    "title": "SaaS",
    "project": "Сервис со входом, кабинетом и одной ключевой функцией",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "8–12 нед.",
    "stack": "TypeScript, Next.js, PostgreSQL"
  },
  {
    "slug": "web-apps",
    "workshop": "services-products",
    "title": "Веб-приложения",
    "project": "Приложение с данными пользователя: трекер, планировщик, мини-CRM",
    "entry": "базовый код",
    "level": "средняя",
    "weeks": "6–10 нед.",
    "stack": "React, API, базы данных"
  },
  {
    "slug": "mobile-apps",
    "workshop": "services-products",
    "title": "Мобильные приложения",
    "project": "Приложение с одним сценарием: PWA или нативное",
    "entry": "базовый JavaScript",
    "level": "высокая",
    "weeks": "8–12 нед.",
    "stack": "PWA, React Native"
  },
  {
    "slug": "own-services",
    "workshop": "services-products",
    "title": "Собственные цифровые сервисы",
    "project": "Узкий сервис: калькулятор, конфигуратор, база данных",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "по выбору автора"
  },
  {
    "slug": "product-management",
    "workshop": "services-products",
    "title": "Продакт-менеджмент",
    "project": "Пакет продукта: гипотезы, карта пути, приоритеты, прототип, план проверки",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "Интервью, таблицы, прототипы"
  },
  {
    "slug": "software-dev",
    "workshop": "code",
    "title": "Разработка ПО",
    "project": "Приложение с тестами и документацией",
    "entry": "базовое программирование",
    "level": "высокая",
    "weeks": "8–12 нед.",
    "stack": "Git, тесты, CI"
  },
  {
    "slug": "frontend",
    "workshop": "code",
    "title": "Фронтенд",
    "project": "Интерфейс с состоянием и доступностью",
    "entry": "базовые HTML и CSS",
    "level": "средняя",
    "weeks": "6–8 нед.",
    "stack": "TypeScript, React"
  },
  {
    "slug": "backend",
    "workshop": "code",
    "title": "Бэкенд",
    "project": "API с авторизацией и базой данных",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "8–10 нед.",
    "stack": "Node.js или Python, PostgreSQL"
  },
  {
    "slug": "fullstack",
    "workshop": "code",
    "title": "Фуллстек",
    "project": "Законченное веб-приложение от базы до интерфейса",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "10–14 нед.",
    "stack": "Next.js, PostgreSQL"
  },
  {
    "slug": "python",
    "workshop": "code",
    "title": "Python",
    "project": "Скрипт или сервис под вашу задачу: разбор отчётов, бот, автоматизация",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "Python"
  },
  {
    "slug": "js-ts",
    "workshop": "code",
    "title": "JavaScript и TypeScript",
    "project": "Интерактивное приложение в браузере",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "JavaScript, TypeScript"
  },
  {
    "slug": "api-integrations",
    "workshop": "infra-security",
    "title": "API и интеграции",
    "project": "Интеграция двух сервисов или своё API с документацией",
    "entry": "базовый код",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "REST, вебхуки, OpenAPI"
  },
  {
    "slug": "databases",
    "workshop": "infra-security",
    "title": "Базы данных",
    "project": "Схема данных проекта с запросами и правами доступа",
    "entry": "базовый код",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "PostgreSQL, SQL"
  },
  {
    "slug": "cloud",
    "workshop": "infra-security",
    "title": "Облако",
    "project": "Проект в облаке с мониторингом",
    "entry": "базовый код",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "Облачные платформы, контейнеры"
  },
  {
    "slug": "devops",
    "workshop": "infra-security",
    "title": "DevOps",
    "project": "Автоматическая сборка, проверка и выкладка проекта",
    "entry": "код и Git",
    "level": "высокая",
    "weeks": "6–8 нед.",
    "stack": "Git, CI, Docker"
  },
  {
    "slug": "cybersecurity",
    "workshop": "infra-security",
    "title": "Кибербезопасность",
    "project": "Проверка своего проекта по чек-листу уязвимостей и исправления",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "4–8 нед.",
    "stack": "OWASP, аутентификация, права доступа"
  },
  {
    "slug": "ai",
    "workshop": "ai-automation",
    "title": "ИИ",
    "project": "Прикладное решение с моделью внутри вашего проекта",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "API моделей, составление запросов"
  },
  {
    "slug": "ai-agents",
    "workshop": "ai-automation",
    "title": "ИИ-агенты",
    "project": "Агент для рутинной задачи с проверкой человеком",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "6–10 нед.",
    "stack": "Модели, инструменты, журнал действий"
  },
  {
    "slug": "automation",
    "workshop": "ai-automation",
    "title": "Автоматизация",
    "project": "Цепочка «событие → действие → уведомление» для личной работы",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "2–4 нед.",
    "stack": "Конструкторы автоматизаций, вебхуки"
  },
  {
    "slug": "business-automation",
    "workshop": "ai-automation",
    "title": "Автоматизация бизнеса",
    "project": "Процесс компании: заявка → CRM → отчёт",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "CRM, таблицы, интеграции"
  },
  {
    "slug": "ai-tools-business",
    "workshop": "ai-automation",
    "title": "ИИ-инструменты для бизнеса",
    "project": "Набор рабочих сценариев ИИ для вашей роли и правила работы с данными",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "2–4 нед.",
    "stack": "ИИ-ассистенты, шаблоны запросов"
  },
  {
    "slug": "data-analytics",
    "workshop": "data",
    "title": "Аналитика данных",
    "project": "Отчёт и дашборд по реальным данным с выводами",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "6–8 нед.",
    "stack": "SQL, таблицы, BI"
  },
  {
    "slug": "data-science",
    "workshop": "data",
    "title": "Наука о данных",
    "project": "Исследование данных с проверенными гипотезами",
    "entry": "базовые Python и статистика",
    "level": "высокая",
    "weeks": "8–12 нед.",
    "stack": "Python, статистика"
  },
  {
    "slug": "machine-learning",
    "workshop": "data",
    "title": "Машинное обучение",
    "project": "Модель на своих данных с оценкой качества и описанием ограничений",
    "entry": "Python",
    "level": "высокая",
    "weeks": "8–12 нед.",
    "stack": "Python, библиотеки машинного обучения"
  },
  {
    "slug": "ux-ui",
    "workshop": "design-media",
    "title": "UX/UI",
    "project": "Прототип интерфейса и записи проверки на нескольких людях",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "Редактор макетов"
  },
  {
    "slug": "graphic-design",
    "workshop": "design-media",
    "title": "Графический дизайн",
    "project": "Фирменный набор: логотип, цвета, шрифты, шаблоны",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "Графические редакторы"
  },
  {
    "slug": "three-d",
    "workshop": "design-media",
    "title": "3D",
    "project": "3D-сцена или объект для сайта или презентации",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "6–10 нед.",
    "stack": "Blender, three.js"
  },
  {
    "slug": "animation",
    "workshop": "design-media",
    "title": "Анимация",
    "project": "Короткая анимация или интерактивный фрагмент",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–8 нед.",
    "stack": "CSS, JavaScript, редакторы анимации"
  },
  {
    "slug": "digital-media",
    "workshop": "design-media",
    "title": "Цифровые медиа",
    "project": "Собственный канал или рассылка с первыми выпусками",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "3–6 нед.",
    "stack": "Монтаж, платформы публикации"
  },
  {
    "slug": "content",
    "workshop": "design-media",
    "title": "Контент",
    "project": "Контент-план и пакет материалов для вашего продукта",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "3–5 нед.",
    "stack": "Редакторы текста, структура материалов"
  },
  {
    "slug": "marketing",
    "workshop": "growth-markets",
    "title": "Маркетинг",
    "project": "План продвижения продукта и запущенный тест канала",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "Аналитика, рассылки"
  },
  {
    "slug": "seo",
    "workshop": "growth-markets",
    "title": "SEO",
    "project": "Страницы сайта под реальные запросы и отчёт",
    "entry": "с нуля",
    "level": "средняя",
    "weeks": "4–6 нед.",
    "stack": "Поисковые консоли, семантика"
  },
  {
    "slug": "entrepreneurship",
    "workshop": "growth-markets",
    "title": "Предпринимательство",
    "project": "Модель продукта: клиент, предложение, цена, расчёт",
    "entry": "с нуля",
    "level": "лёгкая",
    "weeks": "4–6 нед.",
    "stack": "Таблицы, интервью"
  },
  {
    "slug": "startups",
    "workshop": "growth-markets",
    "title": "Стартапы",
    "project": "Рабочая версия и план проверки спроса",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "6–10 нед.",
    "stack": "Инструменты для MVP"
  },
  {
    "slug": "blockchain-web3",
    "workshop": "growth-markets",
    "title": "Блокчейн и Web3",
    "project": "Учебный контракт в тестовой сети без реальных денег; сценарии агентной коммерции",
    "entry": "базовый код",
    "level": "высокая",
    "weeks": "6–10 нед.",
    "stack": "Solidity, тестовая сеть"
  }
];

export const products: Product[] = [
  {
    "slug": "craft-foundation",
    "direction": "entrepreneurship",
    "title": "Довести идею до проверенного плана",
    "result": "Карта проекта, проверенная идея, бизнес-модель, план рабочей версии",
    "entry": "с нуля",
    "term": "шесть этапов",
    "stack": "таблицы, интервью",
    "status": "open",
    "page": {
      "lead": "Шесть этапов от идеи до плана рабочей версии. Вы ведёте собственный проект, наставник проверяет сданные задания.",
      "forWhom": "Тем, у кого есть идея или интерес и нет плана, с чего начать.",
      "notForWhom": "Если нужен готовый продукт без вашего участия, смотрите формат «Команда CRAFT».",
      "inHands": [
        "Карта проекта",
        "Проверенная идея: интервью и выводы",
        "Бизнес-модель с допущениями",
        "План рабочей версии"
      ],
      "time": "Шесть этапов, по три занятия в каждом.",
      "needs": "Таблицы и возможность поговорить с людьми, для которых вы делаете продукт. Программировать не нужно: на выходе план рабочей версии.",
      "boundaries": "Программа не обещает доход, трудоустройство или готовый коммерческий продукт. Она помогает проверить идею и спланировать первую версию.",
      "help": "Практические задания вы сдаёте в кабинете. Наставник проверяет их и оставляет обратную связь там же.",
      "faq": [
        {
          "q": "Нужно ли программировать?",
          "a": "Нет. Программа про идею, спрос и модель; на выходе план рабочей версии, а не код."
        },
        {
          "q": "Будет ли доход?",
          "a": "Доход мы не обещаем. Вы получаете проверенную идею и план; что с ними делать дальше, решаете вы."
        },
        {
          "q": "Что если не получится?",
          "a": "Наставник разбирает, на каком этапе вы остановились и почему. Условия возврата денег пока не утверждены."
        }
      ],
      "next": [
        "site-card",
        "biz-flow"
      ],
      "related": [
        "site-card",
        "bot-requests",
        "biz-flow"
      ]
    }
  },
  {
    "slug": "site-card",
    "direction": "sites",
    "title": "Собрать сайт-визитку с формой заявки",
    "result": "Сайт на своём домене с формой",
    "entry": "с нуля",
    "term": "3–5 недель",
    "stack": "HTML, CSS, Next.js или конструктор",
    "status": "preparing"
  },
  {
    "slug": "shop-20",
    "direction": "online-shops",
    "title": "Запустить интернет-магазин на 20 товаров",
    "result": "Магазин с корзиной; оплата в тестовом режиме",
    "entry": "с нуля",
    "term": "6–8 недель",
    "stack": "конструктор или Next.js",
    "status": "preparing"
  },
  {
    "slug": "bot-requests",
    "direction": "automation",
    "title": "Собрать бота для приёма заявок",
    "result": "Бот, который собирает заявки и присылает вам",
    "entry": "с нуля",
    "term": "2–4 недели",
    "stack": "Python или конструктор",
    "status": "preparing",
    "page": {
      "lead": "Бот в мессенджере спрашивает клиента о главном, сохраняет ответ в таблицу и присылает вам уведомление.",
      "forWhom": "Владельцу небольшого дела, мастеру, специалисту, у которого заявки теряются в личных сообщениях.",
      "notForWhom": "Если нужны оплата в боте, поддержка тысяч диалогов или связь с CRM, смотрите «Автоматизировать заявки малого бизнеса».",
      "notForWhomSlug": "biz-flow",
      "inHands": [
        "Работающий бот",
        "Форма из трёх–пяти вопросов",
        "Таблица заявок",
        "Уведомление вам",
        "Инструкция, как поменять вопросы",
        "Бот зарегистрирован на вас, а не на CRAFT"
      ],
      "route": [
        {
          "stage": "Идея",
          "text": "Какие заявки и откуда приходят."
        },
        {
          "stage": "Исследование",
          "text": "Куда они теряются сейчас."
        },
        {
          "stage": "Проверка",
          "text": "Три разговора с теми, кто вам пишет."
        },
        {
          "stage": "Бизнес-модель",
          "text": "Сколько стоит потерянная заявка, по вашим цифрам."
        },
        {
          "stage": "Рабочая версия",
          "text": "Бот, таблица, уведомление."
        },
        {
          "stage": "Запуск",
          "text": "Подключение к вашему каналу и неделя наблюдения."
        }
      ],
      "time": "2–4 недели, 4–6 часов в неделю. Предварительная оценка, уточнится при открытии набора.",
      "needs": "Аккаунт в мессенджере, таблица, бесплатный тариф конструктора или Python на компьютере. Расходы на сервисы от нуля на бесплатных тарифах; тарифы проверим перед открытием набора.",
      "boundaries": "Бот не заменяет CRM, не принимает оплату и не обещает рост числа заявок.",
      "done": [
        "Клиент оставляет заявку меньше чем за две минуты.",
        "Заявка попадает в таблицу, вам приходит уведомление.",
        "Бот не ломается на пустом и странном вводе.",
        "Вы сами меняете вопрос.",
        "Клиенту написано, как удалить свои данные."
      ],
      "help": "Напарник подсказывает следующий шаг, разбирает ошибку и проверяет по критериям; бот целиком за вас не пишется. Наставник в формате «С наставником»: около двух часов, разбор решений и проверка критериев (предварительно). Команда CRAFT может собрать бота под ключ и передать доступы, код и инструкцию.",
      "formatsNote": "Формат «До запуска» для продукта такого размера не предлагается.",
      "missing": [
        "образец: запись экрана на 90 секунд ещё не снята",
        "оглавление занятий не написано",
        "критерии «готово» не проверены на реальном проекте"
      ],
      "faq": [
        {
          "q": "Нужно ли программировать?",
          "a": "С конструктором нет. С Python нужен базовый код."
        },
        {
          "q": "Будет ли доход?",
          "a": "Доход мы не обещаем. Бот помогает не терять заявки."
        },
        {
          "q": "Что если не получится?",
          "a": "Напарник и наставник разбирают причину. Условия возврата денег пока не утверждены."
        }
      ],
      "next": [
        "biz-flow",
        "site-card"
      ],
      "related": [
        "site-card",
        "biz-flow",
        "ai-agent"
      ]
    }
  },
  {
    "slug": "ai-agent",
    "direction": "ai-agents",
    "title": "Сделать ИИ-агента для рутинной задачи",
    "result": "Агент с инструкциями, инструментами и проверкой человеком",
    "entry": "базовый",
    "term": "6–10 недель",
    "stack": "модели, инструменты, журнал действий",
    "status": "preparing"
  },
  {
    "slug": "biz-flow",
    "direction": "business-automation",
    "title": "Автоматизировать заявки малого бизнеса",
    "result": "Цепочка форма → таблица или CRM → уведомление",
    "entry": "с нуля",
    "term": "4–6 недель",
    "stack": "автоматизации, таблицы",
    "status": "preparing"
  },
  {
    "slug": "saas-v1",
    "direction": "saas",
    "title": "Собрать первую версию SaaS-сервиса",
    "result": "Сервис со входом, кабинетом и одной ключевой функцией",
    "entry": "базовый код",
    "term": "8–12 недель",
    "stack": "Next.js, PostgreSQL",
    "status": "preparing"
  },
  {
    "slug": "webapp-cabinet",
    "direction": "web-apps",
    "title": "Построить веб-приложение с личным кабинетом",
    "result": "Приложение с данными пользователя",
    "entry": "базовый код",
    "term": "6–10 недель",
    "stack": "React, API, БД",
    "status": "preparing"
  },
  {
    "slug": "data-dashboard",
    "direction": "data-analytics",
    "title": "Сделать дашборд по своим данным",
    "result": "Отчёт с выводами и обновляемый дашборд",
    "entry": "с нуля",
    "term": "6–8 недель",
    "stack": "SQL, таблицы, BI",
    "status": "preparing"
  },
  {
    "slug": "ux-prototype",
    "direction": "ux-ui",
    "title": "Спроектировать интерфейс и проверить его на людях",
    "result": "Прототип и записи проверки",
    "entry": "с нуля",
    "term": "4–8 недель",
    "stack": "редактор макетов",
    "status": "preparing"
  },
  {
    "slug": "brand-kit",
    "direction": "graphic-design",
    "title": "Собрать фирменный набор проекта",
    "result": "Логотип, цвета, шрифты, шаблоны",
    "entry": "с нуля",
    "term": "4–6 недель",
    "stack": "графические редакторы",
    "status": "preparing"
  },
  {
    "slug": "scene-3d",
    "direction": "three-d",
    "title": "Создать 3D-сцену для сайта",
    "result": "Сцена, встроенная в страницу",
    "entry": "с нуля",
    "term": "6–10 недель",
    "stack": "Blender, three.js",
    "status": "preparing"
  },
  {
    "slug": "web3-contract",
    "direction": "blockchain-web3",
    "title": "Собрать учебный смарт-контракт в тестовой сети",
    "result": "Контракт и страница к нему; тестовая сеть, без реальных денег",
    "entry": "базовый код",
    "term": "6–10 недель",
    "stack": "Solidity, тестовая сеть",
    "status": "preparing"
  },
  {
    "slug": "secure-project",
    "direction": "cybersecurity",
    "title": "Проверить и защитить свой проект",
    "result": "Отчёт об уязвимостях и исправления",
    "entry": "базовый код",
    "term": "4–8 недель",
    "stack": "чек-лист OWASP, аутентификация, права",
    "status": "preparing"
  }
];

export const workshopBySlug = (slug: string) => workshops.find((item) => item.slug === slug);
export const directionBySlug = (slug: string) => directions.find((item) => item.slug === slug);
export const productBySlug = (slug: string) => products.find((item) => item.slug === slug);

export const directionsOfWorkshop = (workshop: string) => directions.filter((item) => item.workshop === workshop);
export const productsOfDirection = (direction: string) => products.filter((item) => item.direction === direction);
export const workshopOfProduct = (product: Product) => workshopBySlug(directionBySlug(product.direction)?.workshop ?? "");

// На витрине показываются продукты, в которые можно войти или записаться (правило раздела 5).
export const visibleProducts = products.filter((item) => item.status !== "idea");

/** Directions that have at least one product people can see. Empty directions stay out of the storefront. */
export const visibleDirections = directions.filter((direction) => productsOfDirection(direction.slug).some((item) => item.status !== "idea"));

/** Workshops that have at least one visible direction. */
export const visibleWorkshops = workshops.filter((workshop) => visibleDirections.some((direction) => direction.workshop === workshop.slug));

export const visibleProductsOfDirection = (direction: string) => visibleProducts.filter((item) => item.direction === direction);

// Шесть существующих типов продуктов со страницы направлений -> ближайшие направления (раздел 5).
export const legacyTypeNearest: Record<string, string[]> = {
  "direction-01": ["saas", "web-apps", "backend"],
  "direction-02": ["online-shops", "ecommerce", "databases"],
  "direction-03": ["business-automation", "api-integrations", "saas"],
  "direction-04": ["web-apps", "digital-media", "content"],
  "direction-05": ["automation", "ai-agents", "python"],
  "direction-06": ["own-services", "no-code", "startups"],
};
