import { filterAggregate, select, sortAggregate } from './../common/function';
import { PipelineStage } from "mongoose"
import { joinModel, overrideMethodsAggregate, searchTextWithRegexAggregate } from "../common/function"
import { SoftDeleteModel } from 'mongoose-delete';

class AggregateFind {
  private model: SoftDeleteModel<any>
  private pipelineStages: Array<PipelineStage> = []
  private pipelineStagesCount: Array<PipelineStage> = []

  constructor(_model: SoftDeleteModel<any>) {
    this.model = _model
    this.pipelineStages = [overrideMethodsAggregate()]
  }

  searchTextWithRegex = (value: string, fields: string[]) => {
    this.pipelineStages.push(searchTextWithRegexAggregate(value, fields))
  }

  joinModel = (from: string, foreignField: string, localField: string, as: string, justOne?: boolean) => {
    this.pipelineStages.push(joinModel(from, foreignField, localField, as))
    if (justOne) {
      this.pipelineStages.push({ $unwind: `$${as}` })
    }
  }

  filter = (fields: string | string[], values: any[] | any, convertToObjectId?: boolean) => {
    this.pipelineStages.push(filterAggregate(fields, values, convertToObjectId))
  }

  select = (keysSelect: string[], keysUnselect?: string[]) => {
    this.pipelineStages.push(select(keysSelect, keysUnselect))
  }

  sort = (orderBy: string | string[], direction: string | string[]) => {
    this.pipelineStages.push(sortAggregate(orderBy, direction))
  }

  /**
   * Call after all stage
   * @param skip 
   * @param limit 
   */
  paginate = (skip: string | number, limit: string | number) => {
    this.pipelineStagesCount = [...this.pipelineStages]
    this.pipelineStagesCount.push({
      $count: 'total'
    })
    this.pipelineStages.push({
      $skip: Number(skip)
    })
    this.pipelineStages.push({
      $limit: Number(limit)
    })
  }

  async exec() {
    const data = await this.model.aggregateWithDeleted(this.pipelineStages)
    const total = this.pipelineStagesCount.length > 0 ? (await this.model.aggregateWithDeleted(this.pipelineStagesCount))?.[0]?.total || 0 : 0
    return { data, total }
  }
} 

export default AggregateFind
