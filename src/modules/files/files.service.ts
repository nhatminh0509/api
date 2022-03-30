import upload from "../../core/common/upload"

export class FilesService {
  async upload(file) {
    const res = await upload(file)
    console.log(res)
    return { url: res.url }
    // return { url: 'https://appdata.chatwork.com/avatar/RAXjlo9GMr.rsz.png' }
  }

  async upload2(file) {
    const res = await upload(file)
    console.log(res)
    return { url: res.url }
  }
}
