export default {
    trello : {
      auth : {
        token : "{Trello開発者向けトークン}",
        key : "{Trello開発者向けAPIキー}"
      },
      listids : ["{通知したいTrelloのカードが含まれるリストID}", "{通知したいTrelloのカードが含まれるリストID}"]
    },
    slack : {
      notification_caution : {
        webhook_url : "{期限当日のカードを知らせるSlackのwebhook_url}"
      }, 
      notification_alert : {
        webhook_url : "{期限切れのカードを知らせるSlackのwebhook_url}"
      }
    },
    users : [{
        "name" : "{名前}",
        "trello_username" : "{Trelloのプロフィール名}",
        "slack_member_id" : "{SlackのメンバーID}"
      }, {
        "name" : "{名前}",
        "trello_username" : "{Trelloのプロフィール名}",
        "slack_member_id" : "{SlackのメンバーID}"
      }
    ]
}