import PKCE from 'js-pkce';
import utils from "utils"


scope = ["streaming", "user-read-email", "user-read-private"].join(" ")
redirectUri = window.location.origin + '/player.html?spotifyCallback'
spotifyClientId = '71996e28dc6f40cc89f05bd0b030708e'

pkce = new PKCE({
    client_id: spotifyClientId,
    redirect_uri: redirectUri,
    authorization_endpoint: 'https://accounts.spotify.com/authorize',
    token_endpoint: 'https://accounts.spotify.com/api/token',
    requested_scopes: scope,
})


onAuthorized = () ->
    {error, query, state, code} = await pkce.parseAuthResponseUrl window.location.href 
    if error
        localStorage.removeItem("authorizing")
        alert("Error returned from spotify authorization server: "+error)
    else 
        return getAccessToken()


getAccessToken = () ->
    localStorage.setItem("authorizing", 'access_token')
    try
        {access_token, refresh_token} = await pkce.exchangeForAccessToken(window.location.href)
        return {access_token, refresh_token}
    catch err 
        alert("Error from spotify authorization: " + err)

(() -> 
    if window.location.search.includes('spotifyCallback')
        res = await onAuthorized()
        if res?.access_token
            await utils.send 'spotify authorized', {
                access_token: res.access_token
                refresh_token: res.refresh_token,
                client_id: spotifyClientId
            }

        localStorage.removeItem("authorizing")
)()