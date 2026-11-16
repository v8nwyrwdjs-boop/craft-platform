# CRAFT — предварительная доменная модель

Эта модель описывает целевую структуру данных. Она не означает, что БД или API уже реализованы.

## Основные сущности

### User
- id
- email
- display_name
- role: student | mentor | admin
- created_at

### Direction
- id / slug
- title
- summary
- business_model
- monetization_options
- complexity_note
- status
- updated_at

### BusinessConcept
- id / slug
- title
- short_pitch
- problem
- target_audience
- proposed_solution
- monetization_hypotheses
- mvp_scope
- validation_plan
- risks
- research_status
- reviewed_at
- status

### Account / Profile
- User identity and credentials are managed by Supabase Auth.
- Profile: id, display_name, created_at, updated_at.
- Registration is free and does not grant paid-program access.


### StudentProject
- id
- student_id
- origin_type: own_idea | direction | concept
- direction_id (optional)
- concept_id (optional)
- working_title
- problem_hypothesis
- audience_hypothesis
- monetization_hypothesis
- current_stage
- project_status
- created_at
- updated_at

### Program / Module / Lesson
- Program: программа и её версия.
- Module: упорядоченный блок программы.
- Lesson: материал, цели и содержание урока.
- Содержимое урока может включать текст, видео, ссылки, файлы и инструкции.

### Enrollment
- id
- student_id
- program_id
- project_id
- access_status
- started_at
- completed_at

### Assignment / Submission / Feedback
- Assignment: задача, критерии и дедлайн (если используется).
- Submission: ответ ученика, вложения, версия и дата отправки.
- Feedback: комментарий наставника, статус проверки и дата.

### MentorAssignment
- id
- mentor_id
- student_id
- project_id
- assigned_at
- status

### Service / Order / Payment
- Service: описание и версия услуги, цена и условия.
- Order: выбранная услуга, сумма, валюта и статус.
- Payment: provider reference, сумма, валюта, статус и timestamps.
- Секретные платёжные данные не хранятся в CRAFT.

## Ключевые отношения
- Направление может содержать множество бизнес-концепций.
- Ученик может иметь один или несколько проектов.
- Проект может ссылаться на направление или исходную концепцию, но может быть изменён.
- Заявка может ссылаться на направление или концепцию, но не обязана.
- У ученика есть зачисление на программу и связанный проект.
- Наставник назначается вручную на ученика/проект в 1.0.
- Услуги и платежи отделены от учебного прогресса.

## Архитектурные решения
- Каталог публичный и доступен без авторизации.
- Учебный контент и ученические работы приватны.
- Не делать концепцию жёстко связанной с проектом: ученик должен иметь возможность адаптировать или заменить её.
- Хранить историю изменения ключевых гипотез проекта.
- Версионировать учебную программу и коммерческие предложения.
