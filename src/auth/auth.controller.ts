import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles.interface';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  createloginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@Req() request: Express.Request, @GetUser() user: User, @GetUser('email') userEmail: string, @RawHeaders() rawHeaders: string[]) {
    return { user, userEmail, rawHeaders };
  }

  @Get('private2')
  // Primera forma de agregarle metadata en el request
  // @SetMetadata('roles', ['admin', 'super-user'])

  // Segunda forma de agregarle metadata en el request (a traves de custom decorator)
  // @RoleProtected(ValidRoles.superUser)

  // @UseGuards(AuthGuard(), UserRoleGuard)
  @Auth(ValidRoles.admin)
  privateRoute2(@GetUser() user: User) {
    return { user };
  }
}
