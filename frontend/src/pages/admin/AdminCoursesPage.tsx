import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import EmptyState from "../../components/EmptyState";
import Spinner from "../../components/Spinner";
import api from "../../lib/api";
import { getErrorMessage } from "../../lib/error";
import type { Course, CourseForm } from "../../types";
import { formatTuition } from "../../utils/format";

const emptyForm: CourseForm = {
  name: "",
  category: "",
  instructor: "",
  description: "",
  tuition: "",
  capacity: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get<Course[]>("/admin/courses");
        setCourses(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [reload]);

  function openCreateForm() {
    setEditingCourse(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(course: Course) {
    setEditingCourse(course);
    setForm({
      name: course.name,
      category: course.category,
      instructor: course.instructor,
      description: course.description,
      tuition: String(course.tuition),
      capacity: String(course.capacity),
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingCourse(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const capacity = Number(form.capacity);
    const tuition = Number(form.tuition);

    if (editingCourse && capacity < editingCourse.enrolledCount) {
      toast.error(
        `Sĩ số tối đa không được thấp hơn ${editingCourse.enrolledCount} học viên đã ghi danh`,
      );
      return;
    }

    const courseData = {
      name: form.name,
      category: form.category,
      instructor: form.instructor,
      description: form.description,
      tuition,
      capacity,
    };

    setSaving(true);
    try {
      if (editingCourse) {
        await api.patch(`/admin/courses/${editingCourse.id}`, courseData);
        toast.success("Cập nhật khóa học thành công");
      } else {
        await api.post("/admin/courses", courseData);
        toast.success("Thêm khóa học thành công");
      }

      closeForm();
      setReload((value) => value + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleHidden(course: Course) {
    try {
      await api.patch(`/admin/courses/${course.id}`, {
        isHidden: !course.isHidden,
      });
      toast.success(
        course.isHidden ? "Đã hiển thị khóa học" : "Đã ẩn khóa học",
      );
      setReload((value) => value + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function deleteCourse(course: Course) {
    const result = await Swal.fire({
      title: "Xóa khóa học?",
      text: `Bạn có chắc muốn xóa khóa học ${course.name} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa khóa học",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/courses/${course.id}`);
      toast.success("Xóa khóa học thành công");
      setReload((value) => value + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm khóa học
        </button>
      </header>

      {showForm && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Tên khóa học
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Danh mục
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Giảng viên
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) =>
                    setForm({ ...form, instructor: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Học phí (VNĐ)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.tuition}
                  onChange={(e) =>
                    setForm({ ...form, tuition: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Sĩ số tối đa
                <input
                  type="number"
                  min={
                    editingCourse ? Math.max(1, editingCourse.enrolledCount) : 1
                  }
                  step="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {editingCourse && (
                  <span className="mt-1 block text-xs font-normal text-gray-500">
                    Đã có {editingCourse.enrolledCount} học viên ghi danh.
                  </span>
                )}
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Mô tả
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Đang lưu..."
                  : editingCourse
                    ? "Lưu thay đổi"
                    : "Tạo khóa học"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {!showForm &&
        (loading ? (
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
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white">
            <EmptyState message="Chưa có khóa học nào" />
          </div>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Khóa học</th>
                    <th className="px-4 py-3 font-medium">Giảng viên</th>
                    <th className="px-4 py-3 font-medium">Học phí</th>
                    <th className="px-4 py-3 font-medium">Sĩ số</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                    <th className="px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="text-gray-700">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">
                          {course.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {course.category}
                        </p>
                      </td>
                      <td className="px-4 py-4">{course.instructor}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {formatTuition(course.tuition)} đ
                      </td>
                      <td className="px-4 py-4">
                        {course.enrolledCount} / {course.capacity}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            course.isHidden
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {course.isHidden ? "Đang ẩn" : "Đang hiển thị"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(course)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleHidden(course)}
                            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            {course.isHidden ? "Hiện" : "Ẩn"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteCourse(course)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card list */}
            <div className="space-y-3 md:hidden">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-600">
                        {course.category}
                      </p>
                      <h3 className="mt-1 break-words font-semibold text-gray-900">
                        {course.name}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        course.isHidden
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {course.isHidden ? "Đang ẩn" : "Đang hiển thị"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    Giảng viên: {course.instructor}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm">
                    <div>
                      <dt className="text-xs text-gray-500">Học phí</dt>
                      <dd className="mt-1 whitespace-nowrap font-semibold text-gray-900">
                        {formatTuition(course.tuition)} đ
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Sĩ số</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {course.enrolledCount} / {course.capacity}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(course)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleHidden(course)}
                      className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {course.isHidden ? "Hiện" : "Ẩn"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteCourse(course)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ))}
    </div>
  );
}