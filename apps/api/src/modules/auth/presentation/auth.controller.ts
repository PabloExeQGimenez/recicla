import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { AuthService } from '../application/auth.service';
import {
  loginSchema,
  type LoginDTO,
  registerSchema,
  type RegisterDTO,
} from './dto/auth.dto';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { Roles } from '../infrastructure/decorators/roles.decorator';
import { Public } from '../infrastructure/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body(new ZodValidationPipe(loginSchema))
    body: LoginDTO,
  ) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async register(
    @Body(new ZodValidationPipe(registerSchema))
    body: RegisterDTO,
  ) {
    return this.authService.register(
      body.name,
      body.lastName,
      body.email,
      body.password,
      body.role,
      body.dni,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.findById(id, req.user);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.delete(id, req.user);
  }
}
