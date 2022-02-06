import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "src/common/constants"

export class QueryListOrg {
    @ApiProperty({ required: false })
    searchText?: string
    
    @ApiProperty({ required: false })
    domain?: string
    
    @ApiProperty({ required: false })
    owner?: string
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC })
    direction?: SORT_DIRECTION
}

export class CreateOrgInput {
    @ApiProperty({ required: true })
    name: string
    
    @ApiProperty({ required: true })
    domain: string

    @ApiProperty({ required: true })
    owner: string
    
    @ApiProperty({ required: false })
    siteSetting?: object
}

export class UpdateOrgInput {
    @ApiProperty({ required: false })
    name?: string
    
    @ApiProperty({ required: false })
    domain?: string

    @ApiProperty({ required: false })
    owner?: string
}