import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import api from "../lib/api";
import { getErrorMessage } from "../lib/error";
import type { MyEnrollment } from "../types";
import { formatTuition } from "../utils/format";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function loadEnrollments() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get<MyEnrollment[]>("/enrollments/my");
        setEnrollments(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadEnrollments();
  }, [reload]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
      </header>

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
      ) : enrollments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white">
          <EmptyState message="Bạn chưa ghi danh khóa học nào" />
          <div className="pb-6 text-center">
            <Link
              to="/courses"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Xem danh sách khóa học
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {enrollments.map((enrollment) => {
            const isActive = enrollment.status === "ACTIVE";

            return (
              <article
                key={enrollment.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      {enrollment.course.category}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      {enrollment.course.name}
                    </h2>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isActive ? "Đang học" : "Đã hủy"}
                  </span>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between gap-4">
                    <dt>Giảng viên</dt>
                    <dd className="text-right font-medium text-gray-800">
                      {enrollment.course.instructor}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Ngày ghi danh</dt>
                    <dd className="text-right font-medium text-gray-800">
                      {enrollment.enrolledAt}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Học phí</dt>
                    <dd className="text-right font-medium text-gray-800">
                      {formatTuition(enrollment.course.tuition)} đ
                    </dd>
                  </div>
                </dl>

                <Link
                  to={`/courses/${enrollment.course.id}`}
                  className="mt-5 inline-block text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Xem chi tiết khóa học
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
