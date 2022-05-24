import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "src/core/common/constants"
import { User, UserStatus } from "./model"

export class QueryListUser {
    @ApiProperty({ required: false })
    searchText?: string
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
    direction?: SORT_DIRECTION
}

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