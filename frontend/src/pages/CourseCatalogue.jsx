import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService, categoryService } from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Filter, SlidersHorizontal, BookOpen, X } from 'lucide-react';

const CourseCatalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get('level') || 'All'
  );
  const [sortBy, setSortBy] = useState('popular');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch courses whenever filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          level: selectedLevel !== 'All' ? selectedLevel : undefined,
          sort: sortBy,
        };
        const res = await courseService.getAll(params);
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, selectedCategory, selectedLevel, sortBy]);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' || selectedCategory !== 'All' || selectedLevel !== 'All';

  return (
    <div className="catalogue-page">
      {/* Page Header */}
      <div className="catalogue-header">
        <div className="catalogue-header-inner">
          <div className="section-tag">Learning Library</div>
          <h1>Explore Course Catalogue</h1>
          <p>
            Browse all available courses across Programming, Web Development,
            Database Administration, and Artificial Intelligence.
          </p>

          {/* Search bar */}
          <div className="catalogue-search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by course title, technology, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="catalogue-content-container">
        {/* Category Pills Bar */}
        <div className="category-pills-scroll">
          <button
            className={`pill-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('All')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat._id}
              className={`pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-controls-row">
          <div className="filter-group-left">
            <div className="filter-select-wrap">
              <label htmlFor="level-filter">
                <SlidersHorizontal size={14} />
                <span>Level:</span>
              </label>
              <select
                id="level-filter"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="select-input"
              >
                <option value="All">All Skill Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="sort-filter">
                <Filter size={14} />
                <span>Sort By:</span>
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-input"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                Reset Filters
              </button>
            )}
          </div>

          <div className="results-count-text">
            Showing <strong>{courses.length}</strong> courses
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id || course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="empty-state-box">
            <BookOpen size={48} className="empty-icon" />
            <h3>No courses found</h3>
            <p>
              We couldn't find any courses matching your selected filters. Try
              adjusting your search terms or reset the filters.
            </p>
            <button onClick={clearFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogue;

