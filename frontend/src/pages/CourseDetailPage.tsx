import { ArrowLeft, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import api from "../lib/api";
import { getErrorMessage } from "../lib/error";
import { useAccessToken } from "../stores/auth.store";
import type { Course } from "../types";
import { formatTuition } from "../utils/format";

export default function CourseDetailPage() {
  const { id } = useParams();
  const accessToken = useAccessToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const autoEnrollStarted = useRef(false);
  const shouldContinueEnrollment = searchParams.get("enroll") === "true";

  const submitEnrollment = useCallback(async () => {
    if (!id) return;

    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      setCourse((currentCourse) => {
        if (!currentCourse) return currentCourse;

        const enrolledCount = currentCourse.enrolledCount + 1;
        return {
          ...currentCourse,
          enrolledCount,
          remainingSeats: Math.max(currentCourse.capacity - enrolledCount, 0),
          status:
            enrolledCount >= currentCourse.capacity ? "FULL" : "AVAILABLE",
        };
      });
      toast.success("Ghi danh khóa học thành công!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setEnrolling(false);
    }
  }, [id]);

  function handleEnroll() {
    if (!accessToken) {
      navigate("/login", {
        state: {
          from: {
            pathname: `${location.pathname}?enroll=true`,
          },
        },
      });
      return;
    }

    void submitEnrollment();
  }

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get<Course>(`/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id, reload]);

  useEffect(() => {
    if (
      !accessToken ||
      !shouldContinueEnrollment ||
      autoEnrollStarted.current
    ) {
      return;
    }

    autoEnrollStarted.current = true;
    setSearchParams({}, { replace: true });
    void submitEnrollment();
  }, [
    accessToken,
    setSearchParams,
    shouldContinueEnrollment,
    submitEnrollment,
  ]);

  if (loading) return <Spinner />;

  if (error) {
    return (
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
    );
  }

  if (!course) {
    return <EmptyState message="Không tìm thấy khóa học" />;
  }
  const isFull = course.status === "FULL";
  const enrolledPercent =
    course.capacity > 0
      ? Math.min((course.enrolledCount / course.capacity) * 100, 100)
      : 0;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft size={17} />
        Quay lại danh sách khóa học
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {course.category}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            {course.name}
          </h1>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Giới thiệu khóa học
            </h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
              {course.description}
            </p>
          </section>

          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Giảng viên</p>
              <p className="mt-1 font-medium text-gray-900">
                {course.instructor}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo khóa học</p>
              <p className="mt-1 font-medium text-gray-900">
                {course.createdAt}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Học phí</p>
              <p className="mt-1 text-xl font-bold text-blue-700">
                {formatTuition(course.tuition)} đ
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                Số học viên
              </p>
              <p className="mt-1 font-medium text-gray-900">
                {course.enrolledCount} / {course.capacity} học viên
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${
                  isFull ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${enrolledPercent}%` }}
              />
            </div>
            <p
              className={`mt-2 text-sm ${
                isFull ? "text-red-600" : "text-green-700"
              }`}
            >
              {isFull
                ? "Khóa học đã hết chỗ"
                : `Còn ${course.remainingSeats} chỗ`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleEnroll}
            disabled={isFull || enrolling || enrolled}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
          >
            {enrolling
              ? "Đang ghi danh..."
              : enrolled
                ? "Đã ghi danh"
                : isFull
                  ? "Khóa học đã hết chỗ"
                  : "Ghi danh khóa học"}
          </button>
        </div>
      </article>
    </div>
  );
}
