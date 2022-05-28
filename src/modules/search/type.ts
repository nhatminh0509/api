import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "src/core/common/constants"

export class Search {
  @ApiProperty({ required: false })
  searchText?: string

  @ApiProperty({ required: false })
  orgId?: string
  
  @ApiProperty({ required: false })
  limit?: number

  @ApiProperty({ required: false })
  skip?: number
  
  @ApiProperty({ required: false })
  orderBy?: string
  
  @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
  direction?: SORT_DIRECTION
}