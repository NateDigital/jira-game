import client from 'axios'
export default async () => {
    const loginData = {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWORD,
    }
    const path = `${process.env.JIRA_ENDPOINT}/rest/auth/1/session`
    const response = await client.post(path, loginData)
    const session = response.data.session
    const headers = {
        cookie: session.name + '=' + session.value,
        "Content-Type": "application/json"
    }
    return headers
}
