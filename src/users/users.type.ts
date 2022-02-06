import { ApiProperty } from "@nestjs/swagger"
import { User, UserStatus } from "./users.model"

export class CreateUserInput {
    @ApiProperty({ required: true })
    displayName: string
    
    @ApiProperty({ required: true })
    username: string

    @ApiProperty({ required: true })
    password: string
    
    @ApiProperty({ required: false })
    avatar?: string
    
    @ApiProperty({ required: true })
    email: string
    
    @ApiProperty({ required: true })
    phone: string

    @ApiProperty({ required: false })
    roles?: object
    
    @ApiProperty({ required: true, enum: UserStatus })
    status: UserStatus
}

export class UpdateUserInput {
    @ApiProperty({ required: false })
    displayName?: string
    
    @ApiProperty({ required: false })
    username?: string

    @ApiProperty({ required: false })
    password?: string
    
    @ApiProperty({ required: false })
    avatar?: string
    
    @ApiProperty({ required: false })
    email?: string
    
    @ApiProperty({ required: false })
    phone?: string

    @ApiProperty({ required: false })
    roles?: object
    
    @ApiProperty({ required: false, enum: UserStatus })
    status?: UserStatus
}