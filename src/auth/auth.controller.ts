import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from '../types/login-response.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.usersService.create(body.username, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to get access token' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Successfully logged in',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }
}
