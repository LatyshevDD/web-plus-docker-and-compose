import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
