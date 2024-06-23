import './player.less' 

import $ from 'jquery'
import angular from 'angular'
import utils from "utils"

# import '../needsharebutton.min.js'
# import 'angular-ui-bootstrap'

import('bootstrap/dist/css/bootstrap.min.css')
import('../vendor/font-awesome.css')

import 'bootoast/dist/bootoast.min.css'
# import bootoast from 'bootoast/dist/bootoast.min.js'

import { formatOpenURL } from 'spotify-uri'

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
    $scope.trackName = ''
    $scope.trackSaved = false

    $scope.trackHref = ''
    $scope.artistHref = ''
    $scope.albumHref = ''

    getState = () ->
        res = await utils.send 'spotify current state'
        updateState(res) if res 

        chrome.runtime.onMessage?.addListener (request, sender, sendResponse)->
            if request.type == 'spotify state changed'
                updateState(request.state) if request.state 
            if request.type == 'track saved'
                checkTrackSaved()

    checkTrackSaved = () ->
        if $scope.spotifyState.current_track?.id 
            $scope.trackSaved = await utils.send 'checkUserSavedTrack', { trackId: $scope.spotifyState.current_track.id }

            $scope.savingTrack = false
            $scope.$apply()

    safeFormatOpenURL = (uri) ->
        try
            return formatOpenURL uri
        catch 
            return ''

    updateState = (state) ->
        $scope.spotifyState = state 
        # console.log "Spotify state: ", state 

        $scope.isSpotifyReady = state.ready

        $scope.canPause = false 
        $scope.canSeekNext = false 
        $scope.canSeekPrev = false 
        $scope.playing = false 

        $scope.albumImage = null 
        $scope.artistName = ''
        $scope.trackName = state.current_track?.name 

        $scope.trackHref = ''
        $scope.artistHref = ''
        $scope.albumHref = ''

        if state.current_track
            $scope.trackHref = safeFormatOpenURL state.current_track.uri
        if state.current_track?.album
            $scope.albumHref = safeFormatOpenURL state.current_track.album.uri
        if state.current_track?.artists?.length
            $scope.artistHref = safeFormatOpenURL state.current_track.artists[0].uri

        if state.disallows
            $scope.canPause = !state.disallows.pausing
            $scope.canSeekNext = !state.disallows.peeking_next
            $scope.canSeekPrev = !state.disallows.peeking_prev  

        if state.current_track?.album?.images?.length
            $scope.albumImage = state.current_track.album.images.find((n) -> n.width > 200) or \
                state.current_track.album.images[0]
        if state.current_track?.artists?.length 
            $scope.artistName = state.current_track.artists.map((n) -> n.name).join(', ')

        checkTrackSaved()
        
        $scope.playing = !state.paused and state.current_track
        $scope.$apply()

    $scope.toggleAction = (action) -> 
        if not $scope.isSpotifyReady
            window.open('/authorized.html', '_blank')
        else 
            utils.send 'spotify action', { action }
            # window.open('https://open.spotify.com/', '_blank')
    
    $scope.toggleSavedTrack = () ->
        if $scope.spotifyState.current_track and !$scope.savingTrack
            $scope.savingTrack = true

            if $scope.trackSaved 
                res = await utils.send 'removeUserSavedTrack', { trackId: $scope.spotifyState.current_track.id }
                # console.log "remove saved: ", res
            else 
                res = await utils.send 'saveUserTrack', { trackId: $scope.spotifyState.current_track.id }
                # console.log "save: ", res 

            checkTrackSaved($scope.spotifyState.current_track)
    
    $scope.openTrackLink = () ->
        if $scope.isSpotifyReady
            window.open('https://open.spotify.com/', '_blank')
        else 
            $scope.openHelpLink()
    
    $scope.openHelpLink = () ->
        url = 'https://github.com/revir/spotify-on-browser'
        window.open url, '_blank'

    $scope.openOptions = () ->
        utils.send 'open options'

    getState()
]