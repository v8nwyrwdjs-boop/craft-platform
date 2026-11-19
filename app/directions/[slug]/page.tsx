import Link from "next/link";
import { notFound } from "next/navigation";
import { saveCatalogProject } from "@/app/actions/projects";

const directions = [
  { slug:"direction-01", number:"01", title:"SaaS и подписочные сервисы", description:"Цифровые инструменты, которые регулярно решают конкретную задачу и за которые клиент платит по подписке.", models:"Подписка · тарифы · freemium", examples:"Нишевые CRM, планировщики, аналитика, инструменты для специалистов", level:"Средняя / высокая", questions:["Какую повторяющуюся задачу аудитория решает каждую неделю?","Что сейчас используют вместо отдельного сервиса?","За какой результат клиент готов платить регулярно?"] },
  { slug:"direction-02", number:"02", title:"Маркетплейсы", description:"Площадки, которые соединяют две группы пользователей: клиентов и исполнителей, покупателей и продавцов.", models:"Комиссия · платное размещение · подписка", examples:"Нишевые услуги, аренда оборудования, локальные B2B-площадки", level:"Высокая", questions:["Какие две стороны рынка сложно находят друг друга?","Как сегодня возникает доверие между сторонами?","Можно ли вручную организовать первые сделки до разработки платформы?"] },
  { slug:"direction-03", number:"03", title:"B2B-сервисы", description:"Продукты для бизнеса, которые сокращают расходы, экономят время или помогают зарабатывать больше.", models:"Подписка · лицензия · оплата за использование", examples:"Автоматизация процессов, документооборот, клиентские кабинеты", level:"Средняя / высокая", questions:["Какой процесс отнимает у команды больше всего времени?","Сколько стоит текущая проблема в часах или деньгах?","Кто принимает решение о покупке такого инструмента?"] },
  { slug:"direction-04", number:"04", title:"Онлайн-платформы и сообщества", description:"Цифровые пространства вокруг конкретной темы, профессии, интереса или регулярной потребности.", models:"Подписка · платный доступ · комиссия", examples:"Профессиональные сообщества, базы знаний, отраслевые платформы", level:"Средняя", questions:["Зачем участники будут возвращаться на платформу?","Какую ценность создаёт взаимодействие участников?","Что можно дать первым пользователям без большой аудитории?"] },
  { slug:"direction-05", number:"05", title:"Сервисы автоматизации", description:"Инструменты, которые убирают повторяющуюся ручную работу у частных специалистов и компаний.", models:"Подписка · пакеты операций · внедрение", examples:"Запись клиентов, уведомления, отчёты, интеграции", level:"Низкая / средняя", questions:["Какая ручная операция повторяется чаще всего?","Какие ошибки и задержки возникают сейчас?","Можно ли проверить ценность автоматизации на одном процессе?"] },
  { slug:"direction-06", number:"06", title:"Нишевые цифровые продукты", description:"Узкие решения для определённой аудитории. Часто их проще проверить на небольшом сегменте рынка.", models:"Разовая покупка · подписка · платные функции", examples:"Калькуляторы, конфигураторы, базы данных, отраслевые инструменты", level:"Зависит от идеи", questions:["Кто конкретно будет пользоваться продуктом?","Как часто у этой аудитории возникает задача?","Какая минимальная версия уже решает её целиком?"] },
];

export default async function DirectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = directions.find((direction) => direction.slug === slug);
  if (!item) notFound();
  return (
    <main className="catalog-page">
      <header className="header wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><nav><Link href="/directions">Все направления</Link><Link href="/products">Готовые концепции</Link></nav><Link className="header-cta" href="/dashboard">Личный кабинет ↗</Link></header>
      <section className="catalog-hero wrap">
        <p className="eyebrow"><i /> CRAFT / НАПРАВЛЕНИЕ {item.number}</p><p className="catalog-kicker">ПУТЬ 01 — ИССЛЕДОВАНИЕ</p>
        <h1>{item.title}</h1><p className="catalog-lead">{item.description}</p>
        <div className="catalog-meta"><span>Возможная монетизация: {item.models}</span><span>Сложность: {item.level}</span></div>
      </section>
      <section className="catalog-list wrap">
        <div className="detail-grid"><article><span>ПРИМЕРЫ ПРОДУКТОВ</span><p>{item.examples}</p></article><article><span>ВОПРОСЫ ДЛЯ ИССЛЕДОВАНИЯ</span><ul>{item.questions.map((q)=><li key={q}>{q}</li>)}</ul></article></div>
        <div className="catalog-bridge-inner detail-action"><div><p className="eyebrow">СЛЕДУЮЩИЙ ШАГ</p><h2>Преврати направление<br /><em>в конкретную идею.</em></h2><p>Сохрани направление в кабинете. Позже сможешь уточнить гипотезу и заменить её, если исследование приведёт к другой возможности.</p></div><form action={saveCatalogProject}><input type="hidden" name="return_to" value={`/directions/${item.slug}`}/><input type="hidden" name="origin_type" value="direction"/><input type="hidden" name="origin_slug" value={item.slug}/><input type="hidden" name="title" value={item.title}/><button className="button button-dark" type="submit">Добавить в мои проекты ↗</button></form></div>
      </section>
      <footer className="footer wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT.</span></footer>
    </main>
  );
}
