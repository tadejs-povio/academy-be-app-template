import { IsNotEmpty, IsString } from 'class-validator';

export class AuthConfig {
  @IsNotEmpty()
  @IsString()
  jwtTokenSecret!: string;
}
