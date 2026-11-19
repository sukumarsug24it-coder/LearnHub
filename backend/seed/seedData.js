const initialCategories = [
  {
    id: 'cat-1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Build modern responsive websites and full-stack web applications.',
    icon: 'Code2',
    color: '#3b82f6',
  },
  {
    id: 'cat-2',
    name: 'Programming',
    slug: 'programming',
    description: 'Master core programming languages, algorithms, and logic.',
    icon: 'Terminal',
    color: '#10b981',
  },
  {
    id: 'cat-3',
    name: 'Database',
    slug: 'database',
    description: 'Learn SQL, NoSQL (MongoDB), schema design, and query optimization.',
    icon: 'Database',
    color: '#8b5cf6',
  },
  {
    id: 'cat-4',
    name: 'AI & Data Science',
    slug: 'ai-data-science',
    description: 'Harness machine learning, deep neural networks, and data analytics.',
    icon: 'Cpu',
    color: '#f59e0b',
  },
  {
    id: 'cat-5',
    name: 'Cloud & DevOps',
    slug: 'cloud-devops',
    description: 'CI/CD, containerization with Docker, and cloud deployments.',
    icon: 'Cloud',
    color: '#06b6d4',
  },
];

const initialCourses = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development Bootcamp (MERN Stack)',
    shortDescription: 'Master MongoDB, Express, React, and Node.js by building production-grade web applications from scratch.',
    description: 'This comprehensive Full-Stack Bootcamp guides you through every step of modern web engineering. You will start with front-end foundations in React and modern JavaScript, move into building RESTful microservices with Node.js and Express, design scalable data schemas in MongoDB, and deploy full-stack applications with authentication and security best practices.',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    isFree: true,
    duration: '18 hours',
    rating: 4.9,
    numReviews: 342,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 1240,
    instructor: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      bio: 'Principal Software Engineer & Author of "Modern MERN Patterns"',
    },
    learningOutcomes: [
      'Build end-to-end web apps using React, Express, and MongoDB',
      'Implement JWT token authentication & role-based access control',
      'Architect robust RESTful APIs with error handling middleware',
      'Deploy full-stack projects to cloud platforms with CI/CD',
    ],
    prerequisites: ['Basic HTML, CSS, and elementary JavaScript fundamentals.'],
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Full Stack'],
    lessons: [
      {
        id: 'lesson-1-1',
        title: '1. Introduction to Full-Stack Architecture & Ecosystem',
        duration: '12 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
        isPreview: true,
        order: 1,
        content: `### Welcome to Full-Stack Web Development!

In modern web development, a full-stack engineer bridges client-side interfaces and server-side infrastructure.

#### Key Architecture Layers:
1. **Client Tier (Presentation)**: Built with React, HTML5, and CSS3. Responsible for user interactions and state management.
2. **Application Tier (Server Logic)**: Built with Node.js and Express. Handles API endpoints, business logic, validation, and authentication.
3. **Database Tier (Storage)**: Document database MongoDB. Stores structured JSON-like documents with schemas defined via Mongoose.

#### Tools you will use:
- Node.js runtime
- VS Code editor
- Postman for API testing
- React Developer Tools`,
        resources: [
          { title: 'Full-Stack Roadmap Cheat Sheet (PDF)', url: 'https://developer.mozilla.org', type: 'pdf' },
          { title: 'Project Starter Code Repository', url: 'https://github.com', type: 'code' },
        ],
      },
      {
        id: 'lesson-1-2',
        title: '2. Setting Up Express Server & REST Routing',
        duration: '22 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/7H_QH9nipNs',
        isPreview: false,
        order: 2,
        content: `### Building Express.js REST APIs

Express is a fast, minimalist web framework for Node.js.

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(5000, () => console.log('Server running on port 5000'));
\`\`\`

#### Key Concepts:
- **Middleware**: Functions that have access to the request object (\`req\`), response object (\`res\`), and next middleware in cycle.
- **Route Handlers**: Directing incoming HTTP methods (GET, POST, PUT, DELETE) to specific controllers.`,
        resources: [
          { title: 'Express Documentation Reference', url: 'https://expressjs.com', type: 'link' },
        ],
      },
      {
        id: 'lesson-1-3',
        title: '3. Connecting MongoDB & Schema Design with Mongoose',
        duration: '25 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/WDrU305J1yw',
        isPreview: false,
        order: 3,
        content: `### MongoDB and Mongoose ODM

MongoDB stores JSON documents. Mongoose provides a schema-based solution to model your application data.

#### Example User Schema:
\`\`\`javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
});
\`\`\`

#### Indexing and Performance:
Always create indexes on frequently searched fields like \`email\` or \`slug\`.`,
        resources: [
          { title: 'Mongoose Documentation', url: 'https://mongoosejs.com', type: 'link' },
        ],
      },
      {
        id: 'lesson-1-4',
        title: '4. React Frontend Components & State Management',
        duration: '30 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
        isPreview: false,
        order: 4,
        content: `### React Component Architecture

Components are the fundamental building blocks of React applications.

#### Key React Hooks:
- \`useState\`: Manage component-level interactive state.
- \`useEffect\`: Perform side-effects such as API fetching or subscribing to events.
- \`useContext\`: Pass global state (e.g., authentication) throughout component tree without prop drilling.`,
        resources: [
          { title: 'React Official Documentation', url: 'https://react.dev', type: 'link' },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Python for Beginners: From Scratch to Projects',
    shortDescription: 'Learn Python 3 programming step-by-step with real-world scripts, data structures, and automation projects.',
    description: 'Python is one of the most versatile and beginner-friendly programming languages in the world. In this course, you will understand variables, loops, object-oriented programming (OOP), file manipulation, web scraping, and how to build command-line tools.',
    category: 'Programming',
    level: 'Beginner',
    price: 0,
    isFree: true,
    duration: '14 hours',
    rating: 4.8,
    numReviews: 215,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 890,
    instructor: {
      name: 'Dr. Michael Chang',
      email: 'michael.c@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      bio: 'Computer Science Faculty & Python Software Foundation Contributor',
    },
    learningOutcomes: [
      'Write clean, idiomatic Python 3 code',
      'Master data structures: lists, dictionaries, sets, and tuples',
      'Understand Object-Oriented Programming (classes, inheritance)',
      'Automate daily tasks with file I/O and web APIs',
    ],
    prerequisites: ['No prior programming experience required!'],
    tags: ['Python', 'Automation', 'OOP', 'Data Structures'],
    lessons: [
      {
        id: 'lesson-2-1',
        title: '1. Python Installation & Your First Script',
        duration: '10 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        isPreview: true,
        order: 1,
        content: `### Getting Started with Python

Python is celebrated for its clean, readable syntax.

\`\`\`python
# hello_world.py
name = input("Enter your name: ")
print(f"Welcome to LearnHub, {name}!")
\`\`\`

#### Why learn Python?
- Clean, readable syntax
- Massive library ecosystem (NumPy, Pandas, Flask, Django)
- Strong community and infinite application areas`,
        resources: [
          { title: 'Python Official Download & Docs', url: 'https://python.org', type: 'link' },
        ],
      },
      {
        id: 'lesson-2-2',
        title: '2. Variables, Conditionals, and Loops',
        duration: '20 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        isPreview: false,
        order: 2,
        content: `### Control Flow in Python

Learn how to make decisions and repeat execution blocks using \`if\`, \`elif\`, \`else\`, and \`for\` / \`while\` loops.

\`\`\`python
scores = [85, 92, 78, 96, 88]
for score in scores:
    if score >= 90:
        print(f"Grade: A ({score})")
\`\`\``,
        resources: [],
      },
      {
        id: 'lesson-2-3',
        title: '3. Functions and Modular Code Design',
        duration: '25 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/k9TUPpGqYTo',
        isPreview: false,
        order: 3,
        content: `### Creating Reusable Functions

Functions allow you to encapsulate logic, accept arguments, and return computed results.

\`\`\`python
def calculate_grade_average(grades):
    if not grades:
        return 0
    return sum(grades) / len(grades)
\`\`\``,
        resources: [],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'MongoDB & SQL: Complete Database Engineering',
    shortDescription: 'Master relational SQL (PostgreSQL, MySQL) and NoSQL (MongoDB) databases, queries, transactions, and indexing.',
    description: 'Every software application relies on reliable and performant data persistence. This course covers both relational databases (tables, foreign keys, normalization, complex joins) and NoSQL document databases (collections, documents, aggregation pipelines, replication).',
    category: 'Database',
    level: 'Intermediate',
    price: 0,
    isFree: true,
    duration: '12 hours',
    rating: 4.85,
    numReviews: 180,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 650,
    instructor: {
      name: 'Elena Rostova',
      email: 'elena.r@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      bio: 'Database Reliability Engineer and Data Architect',
    },
    learningOutcomes: [
      'Write complex SQL queries with joins, aggregates, and subqueries',
      'Design optimized MongoDB document models and embedding vs referencing',
      'Master the MongoDB Aggregation Pipeline ($match, $group, $project)',
      'Manage database indexes, query plans, and transaction consistency',
    ],
    prerequisites: ['Basic programming knowledge in any language.'],
    tags: ['MongoDB', 'SQL', 'PostgreSQL', 'NoSQL', 'Indexing'],
    lessons: [
      {
        id: 'lesson-3-1',
        title: '1. Relational vs Non-Relational Paradigms',
        duration: '15 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/ZS_kXvOeQ5Y',
        isPreview: true,
        order: 1,
        content: `### When to Choose SQL vs NoSQL

| Dimension | SQL (Relational) | MongoDB (NoSQL) |
|---|---|---|
| Schema | Rigid, predefined columns | Dynamic, flexible BSON documents |
| Scaling | Vertically (strong ACID) | Horizontally (sharding) |
| Relationships | Foreign Keys & JOINs | Embedded subdocs & references |`,
        resources: [],
      },
      {
        id: 'lesson-3-2',
        title: '2. MongoDB CRUD & Aggregation Pipeline',
        duration: '35 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU',
        isPreview: false,
        order: 2,
        content: `### MongoDB Aggregation Pipeline

Aggregation pipelines allow you to transform and aggregate documents through consecutive pipeline stages.

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customer_id", totalSpent: { $sum: "$amount" } } },
  { $sort: { totalSpent: -1 } }
]);
\`\`\``,
        resources: [],
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Modern React & Component Design Systems',
    shortDescription: 'Build fast, responsive, and accessible user interfaces using React 18+, Custom Hooks, and Tailwind styling.',
    description: 'Take your frontend skills to professional senior level. Learn deep React internals: reconciliation, virtual DOM, custom hook patterns, state reduction, compound component patterns, and building reusable design system component libraries.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 0,
    isFree: true,
    duration: '15 hours',
    rating: 4.95,
    numReviews: 410,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 1580,
    instructor: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      bio: 'Principal Software Engineer & Author of "Modern MERN Patterns"',
    },
    learningOutcomes: [
      'Master React 18 concurrency, transitions, and Suspense',
      'Build custom reusable hooks for API fetching and debounce',
      'Design scalable component hierarchies and design tokens',
      'Optimize React rendering performance with memo and useMemo',
    ],
    prerequisites: ['Working knowledge of HTML, CSS, and modern JavaScript (ES6+)'],
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'UI/UX'],
    lessons: [
      {
        id: 'lesson-4-1',
        title: '1. Thinking in React & State Flow',
        duration: '18 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        isPreview: true,
        order: 1,
        content: `### Thinking in React

React decomposes user interfaces into isolated, reusable pieces called components.

#### Principles:
1. Break UI into component hierarchy
2. Build static version first
3. Identify minimal state representation
4. Identify where state should live (lift state up)
5. Add inverse data flow with callbacks`,
        resources: [],
      },
      {
        id: 'lesson-4-2',
        title: '2. Deep Dive: Custom Hooks & Data Fetching',
        duration: '28 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/00lxm_doFYw',
        isPreview: false,
        order: 2,
        content: `### Writing Custom Hooks

Extract component logic into reusable functions with custom hooks.

\`\`\`javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => res.json())
      .then(d => { if (isMounted) { setData(d); setLoading(false); } })
      .catch(err => { if (isMounted) { setError(err); setLoading(false); } });
    return () => { isMounted = false; };
  }, [url]);

  return { data, loading, error };
}
\`\`\``,
        resources: [],
      },
    ],
  },
  {
    id: 'course-5',
    title: 'Practical Artificial Intelligence & Machine Learning',
    shortDescription: 'From core math to training predictive models, neural networks, and deploying LLM applications.',
    description: 'Demystify Machine Learning. Understand supervised and unsupervised learning, linear regression, decision trees, random forests, deep learning architectures, and prompt engineering with modern large language models.',
    category: 'AI & Data Science',
    level: 'Advanced',
    price: 0,
    isFree: true,
    duration: '16 hours',
    rating: 4.88,
    numReviews: 195,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 780,
    instructor: {
      name: 'Dr. Michael Chang',
      email: 'michael.c@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      bio: 'Computer Science Faculty & AI Researcher',
    },
    learningOutcomes: [
      'Understand Supervised and Unsupervised Learning paradigms',
      'Train Scikit-Learn models and evaluate metrics (accuracy, F1, ROC-AUC)',
      'Introduction to Neural Networks and PyTorch tensors',
      'Build generative AI integrations using modern APIs',
    ],
    prerequisites: ['Python basics and high-school math (linear algebra / statistics).'],
    tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
    lessons: [
      {
        id: 'lesson-5-1',
        title: '1. Fundamentals of Machine Learning Models',
        duration: '20 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
        isPreview: true,
        order: 1,
        content: `### What is Machine Learning?

Instead of programming explicit rules, we feed data and labels into an algorithm to automatically learn decision boundaries and patterns.

- **Supervised Learning**: Model learns from input-output pairs (classification, regression).
- **Unsupervised Learning**: Model discovers latent patterns without ground-truth labels (clustering, dimensionality reduction).`,
        resources: [],
      },
    ],
  },
  {
    id: 'course-6',
    title: 'Docker, Containers & Cloud DevOps Fundamentals',
    shortDescription: 'Package, containerize, and deploy full-stack applications with Docker, Docker Compose, and CI/CD pipelines.',
    description: 'Learn modern DevOps tools that every software developer must know. Build lightweight Docker images, orchestrate multi-container apps with Docker Compose, configure automated GitHub Actions pipelines, and deploy to cloud environments.',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    price: 0,
    isFree: true,
    duration: '11 hours',
    rating: 4.79,
    numReviews: 145,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
    enrolledCount: 520,
    instructor: {
      name: 'David Vance',
      email: 'david.v@learnhub.dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      bio: 'Cloud Architect & DevOps Consultant',
    },
    learningOutcomes: [
      'Write production-ready Dockerfiles with multi-stage builds',
      'Compose multi-service architectures (React + Express + MongoDB)',
      'Automate testing and deployments with GitHub Actions CI/CD',
      'Understand container networking, volumes, and secret management',
    ],
    prerequisites: ['Basic command line and web development familiarity.'],
    tags: ['Docker', 'DevOps', 'Containers', 'CI/CD', 'Cloud'],
    lessons: [
      {
        id: 'lesson-6-1',
        title: '1. Why Containers? Docker vs Virtual Machines',
        duration: '14 mins',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/Gjnup-PuquQ',
        isPreview: true,
        order: 1,
        content: `### Docker Architecture

Containers share the host operating system kernel, making them remarkably lightweight, booting in milliseconds, and consuming far less RAM than traditional hypervisor VMs.`,
        resources: [],
      },
    ],
  },
];

const initialUsers = [
  {
    id: 'user-admin-1',
    name: 'Admin User',
    email: 'admin@learnhub.dev',
    // Plaintext default: 'admin123'
    passwordHash: '$2a$10$wJ2gGZzJ9LwZ.9p8W0O7v.Z0s9H8sWbKxPqM9V5fT4w1r2y3u4v5a',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    bio: 'Platform Administrator & Course Reviewer',
  },
  {
    id: 'user-student-1',
    name: 'Alex Johnson',
    email: 'student@learnhub.dev',
    // Plaintext default: 'student123'
    passwordHash: '$2a$10$wJ2gGZzJ9LwZ.9p8W0O7v.Z0s9H8sWbKxPqM9V5fT4w1r2y3u4v5a',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    bio: 'Aspiring Full Stack Engineer passionate about React and Node.js',
  },
];

const initialEnrollments = [
  {
    id: 'enr-1',
    userId: 'user-student-1',
    courseId: 'course-1',
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedLessons: ['lesson-1-1', 'lesson-1-2'],
    progressPercentage: 50,
    isCompleted: false,
    lastAccessedLesson: 'lesson-1-2',
    lastAccessedAt: new Date().toISOString(),
  },
  {
    id: 'enr-2',
    userId: 'user-student-1',
    courseId: 'course-2',
    enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedLessons: ['lesson-2-1'],
    progressPercentage: 33,
    isCompleted: false,
    lastAccessedLesson: 'lesson-2-1',
    lastAccessedAt: new Date().toISOString(),
  },
];

module.exports = {
  initialCategories,
  initialCourses,
  initialUsers,
  initialEnrollments,
};

