import { createZodDto } from 'nestjs-zod';
import { EnrollCourseSchema } from './enrollment.schema';

export class EnrollCourseDTO extends createZodDto(EnrollCourseSchema) {}
