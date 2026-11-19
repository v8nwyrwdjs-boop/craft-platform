import Link from "next/link";
import { notFound } from "next/navigation";
import { saveCatalogProject } from "@/app/actions/projects";

const concepts = [
  { id:"C-01", slug:"C-01", type:"MICRO-SAAS", title:"Управление записью для узких специалистов", problem:"Небольшие студии и частные специалисты теряют время на переписку, переносы и напоминания о визитах.", audience:"Небольшие сервисные бизнесы и независимые специалисты", revenue:"Ежемесячная подписка; тарифы по числу сотрудников или записей", mvp:"Страница записи, календарь, подтверждения и напоминания", difficulty:"Средняя", validation:"Поговорить с 10–15 специалистами, проверить текущие инструменты и готовность платить." },
  { id:"C-02", slug:"C-02", type:"B2B SAAS", title:"Простой контроль заявок для маленьких команд", problem:"Заявки приходят из разных каналов, теряются в чатах и остаются без ответа.", audience:"Небольшие агентства, студии и локальные компании", revenue:"Подписка на команду; платные интеграции", mvp:"Единый список заявок, статусы, ответственный и история контакта", difficulty:"Средняя", validation:"Разобрать процесс обработки заявок у нескольких компаний и получить подтверждение боли." },
  { id:"C-03", slug:"C-03", type:"NICHE MARKETPLACE", title:"Нишевой маркетплейс локальных услуг", problem:"Клиентам сложно находить проверенных исполнителей в узкой категории, а специалистам — получать целевые обращения.", audience:"Покупатели услуг и независимые исполнители в одной нише", revenue:"Комиссия, платное продвижение или подписка исполнителей", mvp:"Каталог, профили, запрос предложения и ручное сведение сторон", difficulty:"Высокая", validation:"Сначала вручную свести спрос и предложение в одной узкой категории." },
  { id:"C-04", slug:"C-04", type:"WORKFLOW TOOL", title:"Сбор документов и статусов в одном кабинете", problem:"Клиенты и подрядчики многократно запрашивают документы и уточняют статус работы по почте и в мессенджерах.", audience:"Небольшие B2B-команды с повторяющимся процессом согласования", revenue:"Подписка по числу проектов или клиентов", mvp:"Клиентский кабинет, чек-лист документов, статусы и уведомления", difficulty:"Средняя", validation:"Найти процесс с частыми повторными запросами и проверить готовность команды сменить текущий способ." },
  { id:"C-05", slug:"C-05", type:"DATA SUBSCRIPTION", title:"Отраслевая база данных с регулярными обновлениями", problem:"Специалисты тратят часы на сбор разрозненной информации, которая быстро устаревает.", audience:"Профессионалы одной конкретной отрасли", revenue:"Подписка на доступ; командные тарифы", mvp:"Курируемая база, фильтры, карточки объектов и дата обновления", difficulty:"Средняя", validation:"Проверить частоту использования информации и ценность актуальности для конкретной аудитории." },
  { id:"C-06", slug:"C-06", type:"CALCULATOR / SAAS", title:"Калькулятор решений для профессиональной ниши", problem:"Специалисты вручную считают стоимость, сроки или параметры по сложным таблицам и разрозненным правилам.", audience:"Одна профессия или сегмент малого бизнеса", revenue:"Бесплатный базовый инструмент и платные функции либо подписка", mvp:"Один точный сценарий расчёта, сохранение результата и экспорт", difficulty:"Низкая / средняя", validation:"Проверить, насколько часто выполняется расчёт, сколько ошибок он создаёт и кто платит за решение." },
];

export default async function ConceptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = concepts.find((concept) => concept.id === id.toUpperCase());
  if (!item) notFound();
  return (
    <main className="catalog-page">
      <header className="header wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><nav><Link href="/directions">Направления</Link><Link href="/products">Все концепции</Link></nav><Link className="header-cta" href="/dashboard">Личный кабинет ↗</Link></header>
      <section className="catalog-hero wrap">
        <p className="eyebrow"><i /> CRAFT / {item.id}</p><p className="catalog-kicker">{item.type}</p>
        <h1>{item.title}</h1><p className="catalog-lead">{item.problem}</p>
        <div className="catalog-meta"><span>Демонстрационная бизнес-гипотеза</span><span>Сложность: {item.difficulty}</span></div>
      </section>
      <section className="catalog-list wrap">
        <div className="detail-grid">
          <article><span>ДЛЯ КОГО</span><p>{item.audience}</p></article>
          <article><span>ВОЗМОЖНАЯ МОНЕТИЗАЦИЯ</span><p>{item.revenue}</p></article>
          <article><span>ПЕРВЫЙ MVP</span><p>{item.mvp}</p></article>
          <article><span>КАК ПРОВЕРЯТЬ</span><p>{item.validation}</p></article>
        </div>
        <div className="catalog-bridge-inner detail-action"><div><p className="eyebrow">СЛЕДУЮЩИЙ ШАГ</p><h2>Адаптируй концепцию<br /><em>под свою аудиторию.</em></h2><p>Сохрани её в своём кабинете и продолжи исследование. Концепция — гипотеза, а не обещание результата.</p></div><form action={saveCatalogProject}><input type="hidden" name="return_to" value={`/products/${item.id}`}/><input type="hidden" name="origin_type" value="concept"/><input type="hidden" name="origin_slug" value={item.id}/><input type="hidden" name="title" value={item.title}/><button className="button button-dark" type="submit">Добавить в мои проекты ↗</button></form></div>
      </section>
      <footer className="footer wrap"><Link className="brand" href="/">CRAFT<span>®</span></Link><p>DIGITAL PRODUCT SCHOOL</p><span>© 2026 CRAFT.</span></footer>
    </main>
  );
}
