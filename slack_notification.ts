import { soxa } from 'https://deno.land/x/soxa/mod.ts'
import { format } from 'https://deno.land/x/date_fns/index.js'
import settings from './settings.js'

export async function notify(): Promise<void> {
    let target_list_on_cards = null;
    for (const listid of settings.trello.listids) {
        let list_on_cards = await soxa.get('https://api.trello.com/1/lists/' + listid + '/cards?key=' + settings.trello.auth.key + '&token=' + settings.trello.auth.token)
        target_list_on_cards = (target_list_on_cards == null) ? list_on_cards.data : target_list_on_cards.concat(list_on_cards.data)
    }

    let today = format(new Date(), 'yyyy-MM-dd')
    //today = '2020-09-02'
    console.log('today : ' + today)

    const tasks_due_today = target_list_on_cards.filter((v: any) => (v['due'] != null && v['due'].slice(0, 10) === today && !v['dueComplete']))
    const overdue_tasks = target_list_on_cards.filter((v: any) => (v['due'] != null && v['due'].slice(0, 10) < today) && !v['dueComplete'])

    console.log("#tasks_due_today");
    console.log(tasks_due_today);
    console.log("#overdue_tasks");
    console.log(overdue_tasks);

    for (const task of tasks_due_today) {
        await notifySlackOfTasksDueToday(task)
    }

    for (const task of overdue_tasks) {
        await notifySlackOfOverdueTasks(task)
    }
}

async function notifySlackOfTasksDueToday(task: any): Promise<void> {
    let mention = ''
    let idMembers = task['idMembers']
    for (const memberId of idMembers) {
        const slack_user_id = await getSlackUserId(memberId)
        mention += '<@' + slack_user_id + '>'
    }

    let message = ''
    if (mention != null) message += mention + "\n"
    message += 'チケットの対応期限が本日迄です。対応をお忘れなく。'+ "\n"
    message += "<" + task['shortUrl'] + "|" + task['name'] + ">"
    let response = await soxa.post(settings.slack.notification_caution.webhook_url, {}, {
      headers: {'Content-type': 'application/json'},
      data: {
          "text": message
      }
    });
}

async function notifySlackOfOverdueTasks(task: any): Promise<void> {
    let mention = ''
    let idMembers = task['idMembers']
    for (const memberId of idMembers) {
        const slack_user_id = await getSlackUserId(memberId)
        mention += '<@' + slack_user_id + '>'
    }

    let message = ''
    if (mention != null) message += mention + "\n"
    message += 'チケットの対応期限が切れています。急ぎ対応をお願いします。'+ "\n"
    message += "<" + task['shortUrl'] + "|" + task['name'] + ">"
    let response = await soxa.post(settings.slack.notification_alert.webhook_url, {}, {
      headers: {'Content-type': 'application/json'},
      data: {
          "text": message
      }
    });
}

async function getSlackUserId(memberId: string): Promise<string> {
    let response = await soxa.get('https://api.trello.com/1/members/' + memberId + '?key=' + settings.trello.auth.key + '&token=' + settings.trello.auth.token)
    const usr = settings.users.find((user: any) => user.trello_username === response.data['username'])
    return usr.slack_member_id
}

