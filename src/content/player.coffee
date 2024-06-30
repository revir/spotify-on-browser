import './player.less' 

import $ from 'jquery'
import angular from 'angular'
import utils from "utils"

import('bootstrap/dist/css/bootstrap.min.css')
import('../vendor/font-awesome.css')

import 'bootoast/dist/bootoast.min.css'

import { formatOpenURL } from 'spotify-uri'

spotifyClientId = '71996e28dc6f40cc89f05bd0b030708e'

# some ui need bootstrap, like dropdown.
musicPlayer = angular.module('musicPlayer', []).config(['$sceProvider',  ($sceProvider)->
    $sceProvider.enabled(false);
])

musicPlayer.controller 'musicPlayerCtrl', ['$scope', '$sce', ($scope, $sce) ->
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
    $scope.browserName = utils.getBrowserName()

    getState = () ->
        res = await utils.send 'spotify current state'
        if utils.isFirefox() 
            res = await utils.send "get spotify current state"

        updateState(res)

        chrome.runtime.onMessage?.addListener (request, sender, sendResponse)->
            if request.type == 'spotify state changed'
                updateState(request.state) if request.state 
            if request.type == 'track saved'
                $scope.trackSaved = true
                $scope.$apply()

    checkTrackSaved = (trackId) ->
        if trackId 
            $scope.trackSaved = await utils.send 'checkUserSavedTrack', { trackId }
            $scope.savingTrack = false
        else 
            $scope.trackSaved = false
            $scope.savingTrack = false

        $scope.$apply()

    safeFormatOpenURL = (uri) ->
        try
            return formatOpenURL uri
        catch 
            return ''

    updateState = (state) ->
        $scope.spotifyState = state 
        $scope.isSpotifyReady = state.ready

        if !state.ready
            $scope.errorMessage =  if state.accountError?.includes("premium users only") 
            then "Unfortunately this player is only possible for Spotify premium users. Please upgrade your account." 
            else state.accountError
        else 
            $scope.errorMessage = ''

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

        theTrack = state.current_track or state.currentPlaying?.track
        disallows = state.disallows or state.currentPlaying?.disallows

        if theTrack
            $scope.trackName = theTrack.name
            $scope.trackHref = safeFormatOpenURL theTrack.uri
            $scope.artistName = theTrack.artists?.map((n) -> n.name).join(', ')
            $scope.albumHref = safeFormatOpenURL theTrack.album?.uri

            checkTrackSaved(theTrack.id)

            if theTrack.album?.images?.length
                $scope.albumImage = theTrack.album.images.find((n) -> n.width > 200) or \
                    theTrack.album.images[0]
            if theTrack.artists?.length 
                $scope.artistName = theTrack.artists.map((n) -> n.name).join(', ')
                $scope.artistHref = safeFormatOpenURL theTrack.artists[0].uri

        if disallows
            $scope.canPause = !disallows.pausing
            $scope.canSeekNext = !disallows.peeking_next
            $scope.canSeekPrev = !disallows.peeking_prev  

        $scope.currentVolume = if state.currentVolume? then state.currentVolume * 100 else null
        $scope.playing = !state.paused and state.current_track
        $scope.$apply()

    $scope.toggleAction = (action) -> 
        if not $scope.isSpotifyReady
            window.open('/authorized.html', '_blank')
        else 
            utils.send 'spotify action', { action }
            # window.open('https://open.spotify.com/', '_blank')
    
    $scope.toggleSavedTrack = () ->
        if $scope.savingTrack 
            return
        if $scope.spotifyState.current_track or $scope.spotifyState.currentPlaying?.track
            $scope.savingTrack = true
            trackId = $scope.spotifyState.current_track?.id or $scope.spotifyState.currentPlaying?.track?.id
            trackName = $scope.spotifyState.current_track?.name or $scope.spotifyState.currentPlaying?.track?.name

            if $scope.trackSaved 
                res = await utils.send 'removeUserSavedTrack', { trackId }
            else 
                res = await utils.send 'saveUserTrack', { trackId }
                utils.send "track saved", { trackId, trackName }

            checkTrackSaved(trackId)

    $scope.onVolumeChange = (volume) ->
        if $scope.currentVolume? and $scope.trackName
            utils.send 'spotify action', { action: 'setVolume', value: ($scope.currentVolume / 100) }

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