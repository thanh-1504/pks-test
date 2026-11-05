import { createZodDto } from 'nestjs-zod';
import {
  CourseQuerySchema,
  CreateCourseSchema,
  UpdateCourseSchema,
} from './course.schema';

export class CreateCourseDTO extends createZodDto(CreateCourseSchema) {}
export class UpdateCourseDTO extends createZodDto(UpdateCourseSchema) {}
export class CourseQueryDTO extends createZodDto(CourseQuerySchema) {}
