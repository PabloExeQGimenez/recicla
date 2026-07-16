import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
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
  resetPasswordSchema,
  type ResetPasswordDTO,
  updateUserSchema,
  type UpdateUserDTO,
} from './dto/auth.dto';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { Roles } from '../infrastructure/decorators/roles.decorator';
import { Public } from '../infrastructure/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y retorna un token JWT',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@recicla.com',
          description: 'Email del usuario',
        },
        password: {
          type: 'string',
          example: 'admin123',
          description: 'Contraseña del usuario',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna token JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body(new ZodValidationPipe(loginSchema))
    body: LoginDTO,
  ) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Crea un nuevo usuario (solo ADMIN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Juan',
          description: 'Nombre del usuario',
        },
        lastName: {
          type: 'string',
          example: 'Pérez',
          description: 'Apellido del usuario',
        },
        email: {
          type: 'string',
          example: 'juan@email.com',
          description: 'Email del usuario',
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'Contraseña (mínimo 6 caracteres)',
        },
        role: {
          type: 'string',
          enum: ['ADMIN', 'OPERADOR'],
          default: 'OPERADOR',
          description: 'Rol del usuario',
        },
        dni: {
          type: 'string',
          example: '12345678',
          description: 'DNI (opcional)',
        },
      },
      required: ['name', 'lastName', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
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
  @ApiOperation({
    summary: 'Obtener perfil',
    description: 'Retorna el perfil del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Retorna todos los usuarios (solo ADMIN)',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Retorna un usuario específico',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.findById(id, req.user);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.delete(id, req.user);
  }

  @Patch('users/:id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Resetear contraseña',
    description: 'Resetea la contraseña de un usuario (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'nuevaPassword123',
          description: 'Nueva contraseña (mínimo 6 caracteres)',
        },
      },
      required: ['password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Contraseña reseteada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async resetPassword(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(resetPasswordSchema))
    body: ResetPasswordDTO,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.resetPassword(id, body.password, req.user);
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Actualizar email',
    description: 'Actualiza el email de un usuario (solo ADMIN)',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'nuevo@email.com',
          description: 'Nuevo email del usuario',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'Email actualizado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async updateEmail(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema))
    body: UpdateUserDTO,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.authService.updateEmail(id, body.email, req.user);
  }
}
