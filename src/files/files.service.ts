import upload from "../common/upload"

export class FilesService {
  async upload(file) {
    const res = await upload(file)
    console.log(res)
    return res
  }
}
