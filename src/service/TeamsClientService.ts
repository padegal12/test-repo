
const clientContext = async (
    teamsClient: typeof microsoftTeams,
    timeout = 10000
) => {
    return new Promise((resolve, reject) => {
        let shouldReject = true
        teamsClient.getContext((teamsContext: any) => {
            shouldReject = false
            resolve({
                ...teamsContext,
                meetingId: teamsContext.meetingId,
                conversationId: teamsContext.chatId,
            })
        })
        setTimeout(() => {
            if (shouldReject) {
                console.error(
                    'Error getting context: Timeout. Make sure you are running the app within teams context and have initialized the sdk'
                )
                reject('Error getting context: Timeout')
            }
        }, timeout)
    })
}


export {
    clientContext
}