# LearnHub – Online Learning and Course Management Platform

> **A full-stack Learning Resource Management System (MERN Stack)** designed for browsing courses, enrolling in learning tracks, accessing modular video/article lessons, tracking completion progress, and managing courses via an administrative CRUD panel.

---

## 1. Project Title
**LearnHub – Online Learning and Course Management Platform**

---

## 2. Technology Stack
- **Frontend**: React.js 18, Vite, HTML5, CSS3, JavaScript (ES6+), React Router v6, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, RESTful Architecture, JWT Authentication, Bcrypt.js, CORS, Morgan
- **Database**: MongoDB & Mongoose ODM (includes an automatic zero-config In-Memory Hybrid Store for instant sandbox evaluation)
- **API Testing**: Postman (preconfigured collection: `LearnHub_Postman_Collection.json`)
- **Code Editor**: VS Code

---

## 3. Main Modules

| Module | Features & Capabilities |
|---|---|
| **User Registration** | Sign up with name, email, password, and role selector (Student / Administrator). Secure bcrypt hashing. |
| **Authentication & Session** | Login with JWT bearer tokens. One-click instant demo account logins for students and admins. |
| **Dashboard** | Student dashboard displaying enrolled tracks, lessons completed counter, streak tracker, and "Resume Course" spotlight. |
| **Course Catalogue** | Full course browsing with instant real-time search, category pill filters, difficulty level filters, and sort options. |
| **Categories** | Categorized tracks across Programming, Web Development, Database Engineering, AI & Data Science, Cloud & DevOps. |
| **Course Details** | High-level curriculum syllabus, instructor bio, learning outcomes, duration, ratings, and one-click enrollment. |
| **Course Enrollment** | Instant enrollment mechanism recording timestamps, course progress, and completed lesson IDs. |
| **My Courses** | Student learning library with tabbed filtering (`All`, `In Progress`, `Completed`), and visual progress bars. |
| **Learning Materials** | Immersive classroom interface: HD video player, structured notes & markdown, downloadable resources, and next/prev stepper. |
| **Progress Tracking** | Dynamic lesson completion checkmarks that calculate real-time percentage progress and award completion badges. |
| **Admin Panel** | Platform KPI metrics: Total courses, users, enrollments, completion rates, category distribution, and top courses. |
| **Manage Courses (Advanced)** | Full CRUD operations: Add new courses with multi-lesson builders, edit metadata, delete with safety modals, and filter by status. |

---

## 4. CRUD Operations
LearnHub implements all four fundamental CRUD operations across its RESTful API and Admin Interface:

1. **Create (C)**:
   - Admin can add new courses via the modal builder (`POST /api/courses`).
   - Define titles, descriptions, categories, thumbnails, learning outcomes, and multiple lesson modules with video URLs and notes.
2. **Read (R)**:
   - Public and students can view all courses (`GET /api/courses`), filter by category/level, and view detailed syllabi (`GET /api/courses/:id`).
   - Students can retrieve their enrolled courses and track progress (`GET /api/enrollments/my`).
3. **Update (U)**:
   - Admin can modify existing courses, change titles, update lesson content, or adjust course status (`PUT /api/courses/:id`).
   - Students update lesson completion state dynamically (`POST /api/enrollments/:courseId/lessons/:lessonId/toggle`).
4. **Delete (D)**:
   - Admin can delete courses with an interactive confirmation modal dialog (`DELETE /api/courses/:id`), safely cleaning associated enrollments.

---

## 5. Project Folder Structure

```
LearnHub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── CourseCatalogue.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── MyCourses.jsx
│   │   │   ├── LearningMaterials.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ManageCourses.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── store.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── adminRoutes.js
│   │   └── categoryRoutes.js
│   ├── seed/
│   │   └── seedData.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── LearnHub_Postman_Collection.json
├── package.json
└── README.md
```

---

## 6. The 10 Expected Pages

1. **Home Page (`/`)**: Hero banner, live platform counters, category cards, featured popular courses, step-by-step workflow overview, and testimonials.
2. **Registration Page (`/register`)**: Account creation form with name, email, password, and role selector (Student or Administrator).
3. **Login Page (`/login`)**: Secure sign-in with email and password, featuring one-click demo credentials for rapid evaluation.
4. **Student Dashboard (`/dashboard`)**: Personalized hub displaying enrolled courses, total lessons finished, overall progress %, and a "Resume Learning" spotlight card.
5. **Course Catalogue (`/courses`)**: Comprehensive searchable list with category pills, difficulty dropdowns, sort filters, and result counters.
6. **Course Details (`/courses/:id`)**: Course banner, instructor bio, prerequisites, detailed syllabus accordion, and one-click "Enroll Now" button.
7. **My Courses (`/my-courses`)**: Student personal learning tracks divided into `All`, `In Progress`, and `Completed` tabs with visual progress bars.
8. **Learning Materials (`/learning/:id`)**: Full-featured Course Player with responsive video/iframe viewer, lecture notes & markdown, downloadable resources, lesson navigation stepper, and completion checkmarks.
9. **Admin Dashboard (`/admin`)**: Administrative statistics, enrollment metrics, completion rate percentages, category distribution bars, and registered users list.
10. **Manage Courses (`/admin/courses`)**: Advanced management view with table search, Add Course modal with dynamic lesson builder, Edit Course modal, and Delete confirmation dialogs.

---

## 7. Demo Accounts & Credentials

For fast evaluation, use the one-click buttons on the Login Page or use these credentials:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@learnhub.dev` | `password123` |
| **Student** | `student@learnhub.dev` | `password123` |

*(You can also register any new student or admin account via the Registration Page).*

---

## 8. Quick Start Guide

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm start
```
*The backend starts at `http://localhost:5000`.*
*(If MongoDB is running on port 27017 or configured in `backend/.env`, it connects automatically; otherwise it gracefully activates the built-in In-Memory Hybrid Store with all seed courses ready to use!)*

### Step 2: Start the Frontend Client
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 9. API Testing with Postman
The repository includes a complete Postman collection ready to import:
- File: `LearnHub_Postman_Collection.json`
- Supports endpoints:
  - `GET /api/health`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/courses`
  - `GET /api/courses/:id`
  - `POST /api/courses` (Admin)
  - `PUT /api/courses/:id` (Admin)
  - `DELETE /api/courses/:id` (Admin)
  - `POST /api/enrollments/:courseId`
  - `GET /api/enrollments/my`
  - `POST /api/enrollments/:courseId/lessons/:lessonId/toggle`
  - `GET /api/admin/stats` (Admin)

