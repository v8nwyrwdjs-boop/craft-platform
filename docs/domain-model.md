# CRAFT — предварительная доменная модель

Модель отражает текущую продуктовую логику. Физическая схема базы данных развивается в supabase/schema.sql.

## Identity and access
### User
- id (UUID, Supabase Auth)
- email (managed by Auth)
- created_at

### Profile
- id (UUID, FK User)
- display_name
- created_at
- updated_at

### Enrollment
- id
- student_id
- program_slug
- status: pending | active | completed | cancelled
- enrolled_at

Enrollment — отдельное решение о доступе к платной программе; регистрация сама по себе не зачисляет пользователя.

## Student work
### StudentProject
- id
- student_id
- title
- origin_type: own_idea | direction | concept
- origin_slug (optional)
- stage
- status
- created_at
- updated_at

Ученик может иметь несколько проектов и менять исходную бизнес-гипотезу в ходе исследования.

### LessonProgress
- id
- student_id
- program_slug
- lesson_slug
- status: in_progress | completed
- completed_at
- updated_at

## Learning and feedback — planned
### Program
- slug
- title
- description
- status

### Module
- id
- program_slug
- title
- position
- expected_outcome

### Lesson
- id
- module_id
- title
- content
- position

### Assignment
- id
- lesson_id
- title
- instructions
- rubric

### AssignmentSubmission
- id
- student_id
- program_slug
- lesson_slug
- response
- status: submitted | reviewing | revision_requested | accepted
- submitted_at

Implemented in public.assignment_submissions for text-only submissions. File attachments and a richer assignment relation remain planned.

### MentorFeedback
- id
- submission_id
- student_id
- mentor_id
- body
- created_at

Implemented in public.mentor_feedback. Staff inserts are limited by RLS to trusted admin/mentor app_metadata roles; students can read only their own feedback.

## Catalogs
### Direction
- slug
- title
- description
- monetization_models
- examples
- complexity
- status

### BusinessConcept
- slug
- title
- problem
- audience
- revenue_hypothesis
- mvp_hypothesis
- validation_approach
- status: draft | published | archived

Каталоги пока статические frontend-данные. Перенос в управляемую БД/CMS — отдельная задача.

## Operations — planned
### MentorAssignment
- id
- student_id
- mentor_id
- project_id
- status
- assigned_at

### Service
- id
- title
- description
- price
- availability

### Order / Payment
- order_id
- student_id
- service_id
- amount
- currency
- status
- provider_reference

Платёжные сущности добавлять только после утверждения юрисдикции, условий, провайдера и возвратной политики.

## Access principles
- Student reads and changes only own profile, projects and progress.
- Enrollment is written only by authorized staff/backend.
- Lesson content is visible only when the user has active enrollment.
- Mentor/admin permissions require explicit roles and server-side checks; do not infer them from user-supplied form fields.
