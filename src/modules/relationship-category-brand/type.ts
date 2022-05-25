import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "src/core/common/constants"
export class QueryListRelationshipCategoryBrand {
    @ApiProperty({ required: false })
    categoryId?: string

    @ApiProperty({ required: false })
    brandId?: string
    
    @ApiProperty({ required: false })
    limit?: number

    @ApiProperty({ required: false })
    skip?: number
    
    @ApiProperty({ required: false })
    orderBy?: string
    
    @ApiProperty({ required: false, default: SORT_DIRECTION.DESC, enum: SORT_DIRECTION })
    direction?: SORT_DIRECTION
}

export class UpdateCategoryRelationshipCategoryBrandInput {
    @ApiProperty({ required: true })
    categoryId: string

    @ApiProperty({ required: true })
    brandIds: string[]
}

export class UpdateBrandRelationshipCategoryBrandInput {
    @ApiProperty({ required: true })
    brandId: string

    @ApiProperty({ required: true })
    categoryIds: string[]
}
