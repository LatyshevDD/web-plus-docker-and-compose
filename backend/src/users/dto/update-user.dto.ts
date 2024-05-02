import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
