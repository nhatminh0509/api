import upload from "../../core/common/upload"

export class FilesService {
  async upload(file) {
    const res = await upload(file)
    console.log(res)
    return res
  }
}
