const bcrypt = require('bcryptjs');
const {
  initialCategories,
  initialCourses,
  initialUsers,
  initialEnrollments,
} = require('../seed/seedData');
const { getMongoStatus } = require('./db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Category = require('../models/Category');

class DataStore {
  constructor() {
    this.categories = JSON.parse(JSON.stringify(initialCategories));
    this.courses = JSON.parse(JSON.stringify(initialCourses));
    this.users = [];
    this.enrollments = JSON.parse(JSON.stringify(initialEnrollments));
    this.initDefaultUsers();
  }

  async initDefaultUsers() {
    const hash = await bcrypt.hash('password123', 10);
    this.users = [
      {
        id: 'user-admin-1',
        _id: 'user-admin-1',
        name: 'Admin User',
        email: 'admin@learnhub.dev',
        password: hash,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        bio: 'Platform Administrator & Chief Educator',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-student-1',
        _id: 'user-student-1',
        name: 'Alex Johnson',
        email: 'student@learnhub.dev',
        password: hash,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: 'Aspiring Full Stack Engineer passionate about React and Node.js',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // --- USER OPERATIONS ---
  async getUserByEmail(email, includePassword = false) {
    if (getMongoStatus()) {
      try {
        const query = User.findOne({ email: email.toLowerCase() });
        if (includePassword) query.select('+password');
        const user = await query.exec();
        if (user) return user;
      } catch (err) {
        // Fallback to memory
      }
    }
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) return null;
    return user;
  }

  async getUserById(id) {
    if (getMongoStatus()) {
      try {
        const user = await User.findById(id).select('-password');
        if (user) return user;
      } catch (err) {
        // Fallback to memory
      }
    }
    const user = this.users.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async createUser({ name, email, password, role = 'student' }) {
    const existing = await this.getUserByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'user-' + Date.now(),
      _id: 'user-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      bio: '',
      createdAt: new Date().toISOString(),
    };

    if (getMongoStatus()) {
      try {
        const mongoUser = await User.create({
          name,
          email,
          password,
          role,
        });
        return mongoUser;
      } catch (err) {
        // Fallback to memory
      }
    }

    this.users.push(newUser);
    const { password: _, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }

  // --- CATEGORIES ---
  async getCategories() {
    if (getMongoStatus()) {
      try {
        const cats = await Category.find();
        if (cats.length > 0) return cats;
      } catch (err) {}
    }
    return this.categories;
  }

  async createCategory(catData) {
    const newCat = {
      id: 'cat-' + Date.now(),
      _id: 'cat-' + Date.now(),
      slug: catData.slug || catData.name.toLowerCase().replace(/\s+/g, '-'),
      ...catData,
    };
    this.categories.push(newCat);
    return newCat;
  }

  // --- COURSE CRUD OPERATIONS ---
  async getCourses({ search, category, level, status, sort } = {}) {
    if (getMongoStatus()) {
      try {
        let query = {};
        if (status) query.status = status;
        if (category && category !== 'All') query.category = category;
        if (level && level !== 'All') query.level = level;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ];
        }
        let courses = await Course.find(query);
        if (courses.length > 0) return courses;
      } catch (err) {}
    }

    let result = [...this.courses];

    if (status) {
      result = result.filter((c) => c.status === status);
    }
    if (category && category !== 'All') {
      result = result.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (level && level !== 'All') {
      result = result.filter(
        (c) => c.level.toLowerCase() === level.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'popular') {
      result.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      result.reverse();
    }

    return result;
  }

  async getCourseById(id) {
    if (getMongoStatus()) {
      try {
        const course = await Course.findById(id);
        if (course) return course;
      } catch (err) {}
    }
    const found = this.courses.find((c) => c.id === id || c._id === id);
    return found || null;
  }

  async createCourse(courseData) {
    const newCourse = {
      id: 'course-' + Date.now(),
      _id: 'course-' + Date.now(),
      status: 'published',
      rating: 5.0,
      numReviews: 1,
      enrolledCount: 0,
      lessons: [],
      learningOutcomes: [],
      prerequisites: [],
      tags: [],
      createdAt: new Date().toISOString(),
      ...courseData,
    };

    // Ensure lessons have ids
    if (newCourse.lessons && Array.isArray(newCourse.lessons)) {
      newCourse.lessons = newCourse.lessons.map((lesson, idx) => ({
        id: lesson.id || lesson._id || `lesson-${newCourse.id}-${idx + 1}`,
        _id: lesson.id || lesson._id || `lesson-${newCourse.id}-${idx + 1}`,
        order: idx + 1,
        ...lesson,
      }));
    }

    if (getMongoStatus()) {
      try {
        const doc = await Course.create(newCourse);
        return doc;
      } catch (err) {}
    }

    this.courses.unshift(newCourse);
    return newCourse;
  }

  async updateCourse(id, updateData) {
    if (getMongoStatus()) {
      try {
        const updated = await Course.findByIdAndUpdate(id, updateData, {
          new: true,
        });
        if (updated) return updated;
      } catch (err) {}
    }

    const index = this.courses.findIndex((c) => c.id === id || c._id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }

    const updated = {
      ...this.courses[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    if (updateData.lessons && Array.isArray(updateData.lessons)) {
      updated.lessons = updateData.lessons.map((lesson, idx) => ({
        id: lesson.id || lesson._id || `lesson-${id}-${idx + 1}`,
        _id: lesson.id || lesson._id || `lesson-${id}-${idx + 1}`,
        order: idx + 1,
        ...lesson,
      }));
    }

    this.courses[index] = updated;
    return updated;
  }

  async deleteCourse(id) {
    if (getMongoStatus()) {
      try {
        await Course.findByIdAndDelete(id);
      } catch (err) {}
    }
    const index = this.courses.findIndex((c) => c.id === id || c._id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    const deleted = this.courses.splice(index, 1)[0];
    // Remove related enrollments
    this.enrollments = this.enrollments.filter((e) => e.courseId !== id);
    return deleted;
  }

  // --- ENROLLMENTS & PROGRESS TRACKING ---
  async enrollUser(userId, courseId) {
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const existing = this.enrollments.find(
      (e) =>
        (e.userId === userId || e.user === userId) &&
        (e.courseId === courseId || e.course === courseId)
    );

    if (existing) {
      return existing;
    }

    const newEnrollment = {
      id: 'enr-' + Date.now(),
      _id: 'enr-' + Date.now(),
      userId,
      user: userId,
      courseId,
      course: courseId,
      enrolledAt: new Date().toISOString(),
      completedLessons: [],
      progressPercentage: 0,
      isCompleted: false,
      lastAccessedLesson: course.lessons && course.lessons.length > 0 ? course.lessons[0].id || course.lessons[0]._id : '',
      lastAccessedAt: new Date().toISOString(),
    };

    this.enrollments.push(newEnrollment);

    // Increment course enrolledCount
    course.enrolledCount = (course.enrolledCount || 0) + 1;

    return newEnrollment;
  }

  async getUserEnrollments(userId) {
    const userEnrs = this.enrollments.filter(
      (e) => e.userId === userId || e.user === userId
    );

    // Populate course details
    return userEnrs.map((enr) => {
      const cId = enr.courseId || enr.course;
      const course = this.courses.find((c) => c.id === cId || c._id === cId);
      return {
        ...enr,
        courseDetails: course || null,
      };
    });
  }

  async getEnrollment(userId, courseId) {
    const enr = this.enrollments.find(
      (e) =>
        (e.userId === userId || e.user === userId) &&
        (e.courseId === courseId || e.course === courseId)
    );
    if (!enr) return null;
    const course = await this.getCourseById(courseId);
    return {
      ...enr,
      courseDetails: course,
    };
  }

  async toggleLessonProgress(userId, courseId, lessonId) {
    let enr = this.enrollments.find(
      (e) =>
        (e.userId === userId || e.user === userId) &&
        (e.courseId === courseId || e.course === courseId)
    );

    if (!enr) {
      // Auto-enroll user if they access a lesson
      enr = await this.enrollUser(userId, courseId);
    }

    const course = await this.getCourseById(courseId);
    const totalLessons = (course && course.lessons) ? course.lessons.length : 1;

    const completed = new Set(enr.completedLessons || []);
    if (completed.has(lessonId)) {
      completed.delete(lessonId);
    } else {
      completed.add(lessonId);
    }

    enr.completedLessons = Array.from(completed);
    enr.progressPercentage = Math.round((enr.completedLessons.length / (totalLessons || 1)) * 100);
    enr.isCompleted = enr.progressPercentage >= 100;
    enr.lastAccessedLesson = lessonId;
    enr.lastAccessedAt = new Date().toISOString();
    if (enr.isCompleted && !enr.completedAt) {
      enr.completedAt = new Date().toISOString();
    }

    return {
      ...enr,
      courseDetails: course,
    };
  }

  // --- STATS / ANALYTICS ---
  async getPlatformStats() {
    const totalCourses = this.courses.length;
    const totalUsers = this.users.length;
    const totalEnrollments = this.enrollments.length;
    const completedEnrollments = this.enrollments.filter((e) => e.isCompleted).length;
    const avgCompletionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    const categoryBreakdown = this.categories.map((cat) => {
      const count = this.courses.filter(
        (c) => c.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        name: cat.name,
        count,
        color: cat.color,
      };
    });

    return {
      totalCourses,
      totalUsers,
      totalEnrollments,
      completedEnrollments,
      avgCompletionRate,
      categoryBreakdown,
      topCourses: [...this.courses]
        .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
        .slice(0, 5),
    };
  }
}

const dataStore = new DataStore();

module.exports = { dataStore };

