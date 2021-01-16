import $ from 'jquery'
import angular from 'angular'
import utils from "utils"
import debounce from 'lodash/debounce'

import PKCE from 'js-pkce';
# import '../needsharebutton.min.js'
# import 'angular-ui-bootstrap'

import('bootstrap/dist/css/bootstrap.min.css')
import('../vendor/font-awesome.css')
import('./player.less') 

import 'bootoast/dist/bootoast.min.css'
# import bootoast from 'bootoast/dist/bootoast.min.js'

import spotifyUri from 'spotify-uri'

spotifyClientId = '71996e28dc6f40cc89f05bd0b030708e'
# some ui need bootstrap, like dropdown.
musicPlayer = angular.module('musicPlayer', []).config(($sceProvider)->
    $sceProvider.enabled(false);
)

musicPlayer.controller 'musicPlayerCtrl', ['$scope', '$sce', ($scope, $sce) ->
    console.log "[musicPlayerCtrl] init"

    $scope.playing = false
    $scope.canSeekNext = false 
    $scope.canSeekPrev = false 
    $scope.canPause = false 
    $scope.albumImage = null
    $scope.artistName = ''
    pkce = null

    # scope = ["streaming", "user-read-email", "user-read-private", "user-read-recently-played", "user-modify-playback-state"].join(" ")
    scope = ["streaming", "user-read-email", "user-read-private"].join(" ")
    redirectUri = window.location.origin + '/authorized.html?spotifyCallback'

    pkce = new PKCE({
        client_id: spotifyClientId,
        redirect_uri: redirectUri,
        authorization_endpoint: 'https://accounts.spotify.com/authorize',
        token_endpoint: 'https://accounts.spotify.com/api/token',
        requested_scopes: scope,
    })

    authorize = () ->
        localStorage.setItem("authorizing", 'code')
        window.open pkce.authorizeUrl()

    onAuthorized = () ->
        {error, query, state, code} = await pkce.parseAuthResponseUrl window.top.location.href 
        if error
            localStorage.removeItem("authorizing")
            alert("Error returned from spotify authorization server: "+error)
        else 
            return getAccessToken()

    getAccessToken = () ->
        localStorage.setItem("authorizing", 'access_token')
        try
            {access_token, refresh_token} = await pkce.exchangeForAccessToken(window.top.location.href)
            return {access_token, refresh_token}
        catch err 
            alert("Error from spotify authorization: " + err)

    getState = () ->
        res = await utils.send 'spotify current state'
        updateState(res) if res 

        chrome.runtime.onMessage?.addListener (request, sender, sendResponse)->
            if request.type == 'spotify state changed'
                updateState(request.state) if request.state 
        

    updateState = (state) ->
        $scope.spotifyState = state 
        console.log "Spotify state: ", state 

        $scope.isSpotifyReady = state.ready

        $scope.canPause = false 
        $scope.canSeekNext = false 
        $scope.canSeekPrev = false 
        $scope.playing = false 

        $scope.albumImage = null 
        $scope.artistName = ''

        if state.disallows
            $scope.canPause = !state.disallows.pausing
            $scope.canSeekNext = !state.disallows.peeking_next
            $scope.canSeekPrev = !state.disallows.peeking_prev  

        if state.current_track?.album?.images?.length
            $scope.albumImage = state.current_track.album.images.find((n) -> n.width > 200) or \
                state.current_track.album.images[0]
        if state.current_track?.artists?.length 
            $scope.artistName = state.current_track.artists.map((n) -> n.name).join(', ')
        
        $scope.playing = !state.paused and state.current_track
        $scope.$apply()

    $scope.toggleAction = (action) -> 
        if not $scope.isSpotifyReady
            authorize()
        else if $scope.spotifyState?.current_track
            utils.send 'spotify action', { action }
        else 
            window.open('https://open.spotify.com/', '_blank')
    
    $scope.openTrackLink = () ->
        if $scope.spotifyState?.current_track
            url = spotifyUri.formatOpenURL $scope.spotifyState.current_track.uri
            window.open url, '_blank'
        else 
            $scope.openHelpLink()
    
    $scope.openHelpLink = () ->
        url = 'https://revir.github.io/2020/12/02/I-put-a-spotify-player-on-Dictionariez/'
        window.open url, '_blank'


    if localStorage.getItem("authorizing") == 'code' and window.location.search.includes('spotifyCallback')
        res = await onAuthorized()
        if res?.access_token
            await utils.send 'spotify authorized', {
                access_token: res.access_token
                refresh_token: res.refresh_token,
                client_id: spotifyClientId
            }

        localStorage.removeItem("authorizing")
    getState()
]
    