import { ApiProperty } from "@nestjs/swagger"

export class SignInInput {
  @ApiProperty({ required: true })
  userNameOrEmail: string
  
  @ApiProperty({ required: true })
  password: string
}
