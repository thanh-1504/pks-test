const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
});
export const formatDate = (d: Date) => dateFormatter.format(d);

export function formatResponseCourse<
  T extends {
    enrolledCount: number;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  },
>(course: T) {
  const { deletedAt, createdAt, updatedAt, ...rest } = course;
  return {
    ...rest,
    createdAt: formatDate(createdAt),
    updatedAt: formatDate(updatedAt),
    status: course.enrolledCount >= course.capacity ? 'FULL' : 'AVAILABLE',
    remainingSeats: Math.max(course.capacity - course.enrolledCount, 0),
  };
}
