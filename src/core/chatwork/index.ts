import axios from "axios";

export default class ChatWork {
  static async sendMessage (message) {
    await axios({
      method: 'POST',
      url: 'https://api.chatwork.com/v2/rooms/278784929/messages',
      data: `body=${message}`,
      headers: {
        "X-ChatWorkToken": "8665618fc548fe84b658492d7607f6d5"
      }
    })
  }
}