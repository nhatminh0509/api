import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "../common/constants"
import Permissions from "../permissions"

export class SignInInput {
  @ApiProperty({ required: true })
  userNameOrEmail: string
  
  @ApiProperty({ required: true })
  password: string
}

export class CreateRoleInput {
  @ApiProperty({ required: true })
  name: string

  @ApiProperty({ enum: Permissions, isArray: true, default: [] })
  permissions: Permissions[]

  @ApiProperty({ required: true, default: 0 })
  priority: number

  @ApiProperty({ required: false, default: null })
  orgId?: string
}

export class UpdateRoleInput {
  @ApiProperty({ required: false })
  name?: string

  @ApiProperty({ required: false })
  permissions?: Permissions[]

  @ApiProperty({ required: false })
  priority?: number

  @ApiProperty({ required: false })
  orgId?: string
}

export class QueryListRole {
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