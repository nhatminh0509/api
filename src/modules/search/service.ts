import { forwardRef, Inject } from "@nestjs/common";
import { SORT_DIRECTION } from "src/core/common/constants";
import { CategoryService } from "../category/service";
import { KeywordService } from "../keyword/service";
import { ProductsService } from "../product/service";
import { Search } from "./type";

export class SearchService {
  constructor(
    @Inject(forwardRef(() => KeywordService)) private readonly keywordService: KeywordService,
    @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
  ) {}

  async search(query: Search) {
    const { searchText, orgSlug, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    const keywords = await this.keywordService.findAll({ searchText, orgSlug })
    const idsKeyword = keywords.map(item => item._id)
    const product = await this.productService.findByKeywords({
      keywords: idsKeyword,
      direction,
      limit,
      orderBy,
      skip
    })
    const categories = await this.categoryService.findByKeywords({
      keywords: idsKeyword,
      direction,
      limit,
      orderBy,
      skip
    })
    return { 
      product,
      categories
    }
  } 
}
