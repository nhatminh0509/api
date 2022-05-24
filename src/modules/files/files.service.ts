import upload from "../../core/common/upload"

export class FilesService {
  async upload(file) {
    const res = await upload(file)
    return { url: res.url }
  }
}
