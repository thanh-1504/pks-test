import { ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "../types";
import { formatTuition } from "../utils/format";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const isFull = course.enrolledCount >= course.capacity;
  const enrolledPercent =
    course.capacity > 0
      ? Math.min((course.enrolledCount / course.capacity) * 100, 100)
      : 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {course.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {course.description}
        </p>

        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Giảng viên:</span>{" "}
            {course.instructor}
          </p>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users size={15} />
                Sĩ số
              </span>
              <span className={isFull ? "text-red-600" : ""}>
                {course.enrolledCount} / {course.capacity}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${
                  isFull ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${enrolledPercent}%` }}
              />
            </div>
            <p
              className={`mt-1 text-xs ${
                isFull ? "text-red-600" : "text-green-700"
              }`}
            >
              {isFull ? "Hết chỗ" : "Còn chỗ"}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Học phí</p>
            <p className="font-bold text-blue-700">
              {formatTuition(course.tuition)} đ
            </p>
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Xem chi tiết
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
