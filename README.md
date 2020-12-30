# これは何か？

Trelloでタスク管理をしている人向けの期限当日／期限切れのTrelloのタスクをSlackに通知するツールです。  
cron等で定期実行することにより、以下のような事が実現できます。
- 毎朝、期限当日のTrelloのタスクをSlackに通知する。
- 毎朝、期限切れのTrelloのタスクをSlackに通知する。

# どう使うのか？

## setting.js の設定

ちょっと手間ですが、setting.jsに値を設定します。  
各項目にどのような値を設定すればよいのかは、以下の記事を参考にしてください。

[キャラが可愛いので、DenoでTrelloの期限切れタスクをSlackに通知する \- Qiita](https://qiita.com/George22e/items/22ff225e172ed8f65788)


```setting.js
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
```

## 実行方法

```
deno run --allow-net main.ts
```
