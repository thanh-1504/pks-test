import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import Spinner from "../../components/Spinner";
import api from "../../lib/api";
import { getErrorMessage } from "../../lib/error";
import type { AdminEnrollment, Course } from "../../types";

export default function EnrollmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [enrollmentsError, setEnrollmentsError] = useState("");
  const [reloadCourses, setReloadCourses] = useState(0);
  const [reloadEnrollments, setReloadEnrollments] = useState(0);

  useEffect(() => {
    async function loadCourses() {
      setLoadingCourses(true);
      setCoursesError("");

      try {
        const response = await api.get<Course[]>("/admin/courses");
        setCourses(response.data);
      } catch (err) {
        setCoursesError(getErrorMessage(err));
      } finally {
        setLoadingCourses(false);
      }
    }

    loadCourses();
  }, [reloadCourses]);

  useEffect(() => {
    if (!selectedCourseId) {
      setEnrollments([]);
      setEnrollmentsError("");
      return;
    }

    let cancelled = false;

    async function loadEnrollments() {
      setLoadingEnrollments(true);
      setEnrollmentsError("");
      setEnrollments([]);

      try {
        const response = await api.get<AdminEnrollment[]>(
          `/admin/courses/${selectedCourseId}/enrollments`,
        );
        if (!cancelled) {
          setEnrollments(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setEnrollmentsError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingEnrollments(false);
        }
      }
    }

    loadEnrollments();

    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, reloadEnrollments]);

  const selectedCourse = courses.find(
    (course) => String(course.id) === selectedCourseId,
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Danh sách ghi danh</h1>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Khóa học
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={
              loadingCourses || Boolean(coursesError) || courses.length === 0
            }
            className="mt-2 ml-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 sm:max-w-xl"
          >
            <option value="">Chọn khóa học</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
                {course.isHidden ? " (Đang ẩn)" : ""}
              </option>
            ))}
          </select>
        </label>

        {loadingCourses ? (
          <Spinner />
        ) : coursesError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{coursesError}</p>
            <button
              type="button"
              onClick={() => setReloadCourses((value) => value + 1)}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        ) : courses.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Hiện chưa có khóa học nào.
          </p>
        ) : null}
      </section>

      {selectedCourseId && !loadingCourses && !coursesError && (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                {selectedCourse?.name}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <Users size={15} />
                {loadingEnrollments
                  ? "Đang tải danh sách..."
                  : `${enrollments.length} học viên`}
              </p>
            </div>
            {selectedCourse && (
              <p className="text-sm text-gray-500">
                Sĩ số: {selectedCourse.enrolledCount} /{" "}
                {selectedCourse.capacity}
              </p>
            )}
          </div>

          {loadingEnrollments ? (
            <Spinner />
          ) : enrollmentsError ? (
            <div className="p-5">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{enrollmentsError}</p>
                <button
                  type="button"
                  onClick={() => setReloadEnrollments((value) => value + 1)}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : enrollments.length === 0 ? (
            <EmptyState message="Khóa học này chưa có học viên ghi danh" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Họ và tên</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Khóa học</th>
                    <th className="px-5 py-3 font-medium">Thời gian đăng ký</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="text-gray-700">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {enrollment.fullName}
                      </td>
                      <td className="px-5 py-4">{enrollment.email}</td>
                      <td className="px-5 py-4">{enrollment.courseName}</td>
                      <td className="px-5 py-4">{enrollment.enrolledAt}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            enrollment.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {enrollment.status === "ACTIVE"
                            ? "Đang học"
                            : "Đã hủy"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
