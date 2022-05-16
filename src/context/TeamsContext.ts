import React from 'react'
const TeamsContext = React.createContext({
    teamsContext: { userPrincipalName: '' },
    authCode: '',
})
export default TeamsContext