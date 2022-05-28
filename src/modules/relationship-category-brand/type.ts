import { ApiProperty } from "@nestjs/swagger"
import { SORT_DIRECTION } from "src/core/common/constants"
export class QueryListRelationshipCategoryBrand {
    @ApiProperty({ required: false })
    categorySlug?: string

    @ApiProperty({ required: false })
    brandSlug?: string
    
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
    categorySlug: string

    @ApiProperty({ required: true })
    brandsSlug: string[]
}

export class UpdateBrandRelationshipCategoryBrandInput {
    @ApiProperty({ required: true })
    brandSlug: string

    @ApiProperty({ required: true })
    categoriesSlug: string[]
}
