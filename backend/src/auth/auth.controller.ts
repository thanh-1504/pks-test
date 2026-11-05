import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { LoginDTO, RefreshTokenDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  register(@Body() payload: RegisterDTO) {
    return this.authService.register(payload);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() payload: LoginDTO) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  refresh(@Body() payload: RefreshTokenDTO) {
    return this.authService.refresh(payload.refreshToken);
  }
}
