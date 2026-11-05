import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import api from "../lib/api";
import { getErrorMessage } from "../lib/error";
import type { Course } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError("");
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          api.get<Course[]>("/courses"),
          api.get<string[]>("/courses/categories"),
        ]);
        setCourses(coursesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [reload]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">Tìm kiếm khóa học</span>
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khóa học theo tên..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Tất cả", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách khóa học
          </h2>
          {!loading && !error && (
            <span className="text-sm text-gray-500">
              {filteredCourses.length} khóa học
            </span>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setReload((value) => value + 1)}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <EmptyState message="Không tìm thấy khóa học phù hợp" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
