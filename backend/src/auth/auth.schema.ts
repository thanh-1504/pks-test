import z from 'zod';

export const RegisterSchema = z.object({
  fullName: z.string().trim().min(1, 'Họ tên không để trống').max(100),
  email: z.string().trim().toLowerCase().email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải ít nhất 6 ký tự')
    .max(50, 'Mật khẩu tối đa 50 ký tự'),
});

export const LoginSchema = RegisterSchema.pick({
  email: true,
  password: true,
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Thiếu refresh token'),
});
