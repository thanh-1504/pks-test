import z from 'zod';

export const CourseSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(1, 'Tên khóa học không được để trống'),
  category: z.string().trim().min(1, 'Danh mục không được để trống'),
  instructor: z.string().trim().min(1, 'Tên giảng viên không được để trống'),
  description: z.string().trim().min(1, 'Mô tả khóa học không để trống'),
  tuition: z.number().int().nonnegative('Học phí không được là số âm'),
  capacity: z.number().int().positive('Sức chứa phải lớn hơn 0'),
  enrolledCount: z.number().int().nonnegative().default(0),
  isHidden: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

export const CourseQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
});

export const CreateCourseSchema = CourseSchema.pick({
  name: true,
  category: true,
  instructor: true,
  description: true,
  tuition: true,
  capacity: true,
});

export const UpdateCourseSchema = CreateCourseSchema.partial()
  .extend({ isHidden: z.boolean().optional() })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'Cần ít nhất một trường để cập nhật',
  });
