import { IsString } from 'class-validator';

export class AuthConfig {
  @IsString()
  jwtTokenSecret!: string;
}
