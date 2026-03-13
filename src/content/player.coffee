import './player.less'

import $ from 'jquery'
import angular from 'angular'
import utils from "utils"

# Make jQuery global for Bootstrap plugins
window.jQuery = window.$ = $

import('bootstrap/dist/css/bootstrap.min.css')
import('bootstrap/dist/js/bootstrap.min.js').then -> 
    $('[data-toggle="tooltip"]').tooltip()
    
import('../vendor/font-awesome.css')

import 'bootoast/dist/bootoast.min.css'

import { formatOpenURL } from 'spotify-uri'

# Refresh tooltips for dynamically added elements
refreshTooltips = () ->
    setTimeout ->
        $('[data-toggle="tooltip"]').tooltip()
    , 100

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

    # Seekbar
    $scope.progressPercent = 0
    $scope.currentTimeFormatted = '0:00'
    $scope.durationFormatted = '0:00'
    $scope.currentPosition = 0
    $scope.duration = 0
    currentTrackId = null

    formatTime = (ms) ->
        return '0:00' if !ms
        totalSeconds = Math.floor(ms / 1000)
        minutes = Math.floor(totalSeconds / 60)
        seconds = totalSeconds % 60
        "#{minutes}:#{if seconds < 10 then '0' else ''}#{seconds}"

    updateProgress = () ->
        if $scope.duration > 0
            $scope.progressPercent = Math.min(100, ($scope.currentPosition / $scope.duration) * 100)
            $scope.currentTimeFormatted = formatTime($scope.currentPosition)
            $scope.durationFormatted = formatTime($scope.duration)

    # Progress timer for smooth updates during playback
    progressInterval = null
    startProgressTimer = () ->
        stopProgressTimer()
        progressInterval = setInterval () ->
            if $scope.playing and $scope.currentPosition < $scope.duration
                $scope.currentPosition += 1000
                updateProgress()
                $scope.$apply() if !$scope.$$phase
        , 1000

    stopProgressTimer = () ->
        clearInterval(progressInterval) if progressInterval

    $scope.seekTo = ($event) ->
        return unless $scope.duration > 0
        track = $event.currentTarget
        rect = track.getBoundingClientRect()
        percent = ($event.clientX - rect.left) / rect.width
        percent = Math.max(0, Math.min(1, percent))
        seekPosition = Math.floor(percent * $scope.duration)
        $scope.currentPosition = seekPosition
        updateProgress()
        utils.send 'spotify action', { action: 'seek', value: seekPosition }

    # Tab navigation
    $scope.activeTab = 'playing'
    $scope.playlists = []
    $scope.savedShows = []
    $scope.savedAlbums = []
    $scope.featuredPlaylists = []

    # Queue
    $scope.showQueue = false
    $scope.queue = []

    $scope.toggleQueue = () ->
        $scope.showQueue = !$scope.showQueue
        if $scope.showQueue
            loadQueue()

    $scope.closeQueue = () ->
        $scope.showQueue = false

    $scope.playQueueTrack = (track) ->
        # Find track position in queue and skip to it
        index = $scope.queue.indexOf(track)
        if index >= 0
            # Skip forward (index + 1) times to reach the track
            skipCount = index + 1
            skipNext = () ->
                if skipCount > 0
                    skipCount--
                    utils.send 'spotify action', { action: 'nextTrack' }
                    setTimeout(skipNext, 300) if skipCount > 0
            skipNext()
        $scope.showQueue = false

    loadQueue = () ->
        result = await utils.send 'getQueue'
        if result?.queue
            $scope.queue = result.queue
            $scope.$apply() if !$scope.$$phase
            setTimeout(() ->
                refreshTooltips()
            , 50)

    # Playback Mode: off -> shuffle -> repeat
    $scope.playbackMode = 'off'

    getPlaybackModeLabel = () ->
        switch $scope.playbackMode
            when 'shuffle' then 'Shuffle'
            when 'repeat' then 'Repeat One'
            else 'Normal'

    $scope.togglePlaybackMode = () ->
        if $scope.playbackMode == 'off'
            # Switch to shuffle mode
            $scope.playbackMode = 'shuffle'
            utils.send 'setShuffle', { state: true }
            utils.send 'setRepeatMode', { state: 'context' }
        else if $scope.playbackMode == 'shuffle'
            # Switch to repeat one mode
            $scope.playbackMode = 'repeat'
            utils.send 'setShuffle', { state: false }
            utils.send 'setRepeatMode', { state: 'track' }
        else
            # Switch to off
            $scope.playbackMode = 'off'
            utils.send 'setShuffle', { state: false }
            utils.send 'setRepeatMode', { state: 'off' }
        # Update tooltip's data-original-title and visible tooltip text
        setTimeout(() ->
            label = getPlaybackModeLabel()
            $('.playback-mode-btn').attr('data-original-title', label)
            # Also update currently visible tooltip
            $('.tooltip .tooltip-inner').text(label)
        , 50)

    $scope.switchToLibrary = () ->
        $scope.activeTab = 'library'
        loadLibrary()
        $scope.$apply() if !$scope.$$phase

    loadLibrary = () ->
        if $scope.playlists.length == 0
            loadPlaylists()
        if $scope.savedShows.length == 0
            loadSavedShows()
        if $scope.savedAlbums.length == 0
            loadSavedAlbums()
        if $scope.featuredPlaylists.length == 0
            loadFeaturedPlaylists()

    loadPlaylists = () ->
        playlists = await utils.send 'getPlaylists'
        if playlists?.items
            $scope.playlists = playlists.items
            $scope.$apply() if !$scope.$$phase
            refreshTooltips()

    loadSavedShows = () ->
        shows = await utils.send 'getSavedShows'
        if shows?.items
            $scope.savedShows = shows.items.map((item) -> item.show)
            $scope.$apply() if !$scope.$$phase
            refreshTooltips()

    loadSavedAlbums = () ->
        albums = await utils.send 'getSavedAlbums'
        if albums?.items
            $scope.savedAlbums = albums.items.map((item) -> item.album)
            $scope.$apply() if !$scope.$$phase
            refreshTooltips()

    loadFeaturedPlaylists = () ->
        featured = await utils.send 'getFeaturedPlaylists'
        if featured?.playlists?.items
            $scope.featuredPlaylists = featured.playlists.items
            $scope.$apply() if !$scope.$$phase
            refreshTooltips()

    $scope.playLikedSongs = () ->
        utils.send 'spotify action', { action: 'playContext', value: 'spotify:user:me:collection' }
        $scope.activeTab = 'playing'

    $scope.playPlaylist = (playlist) ->
        utils.send 'spotify action', { action: 'playContext', value: playlist.uri }
        $scope.activeTab = 'playing'

    $scope.playAlbum = (album) ->
        utils.send 'spotify action', { action: 'playContext', value: album.uri }
        $scope.activeTab = 'playing'

    $scope.playShow = (show) ->
        utils.send 'spotify action', { action: 'playContext', value: show.uri }
        $scope.activeTab = 'playing'

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
        else if state.autoPlayError
            $scope.errorMessage = state.autoPlayError
            console.log "auto play error", state.autoPlayError
        else 
            # console.log "no error, state is ready."
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
            if theTrack.artistInfo?.images?.length
                $scope.artistImage = theTrack.artistInfo.images[0]
                # console.log "artist image", $scope.artistImage
            else 
                $scope.artistImage = null

        if disallows
            $scope.canPause = !disallows.pausing
            $scope.canSeekNext = !disallows.peeking_next
            $scope.canSeekPrev = !disallows.peeking_prev  

        $scope.currentVolume = if state.currentVolume? then state.currentVolume * 100 else $scope.currentVolume
        $scope.playing = !state.paused and state.current_track

        # Update seekbar progress
        # Reset seekbar when track changes
        if theTrack?.id and theTrack.id != currentTrackId
            currentTrackId = theTrack.id
            $scope.currentPosition = state.position or 0
            $scope.duration = theTrack.duration_ms or 0
        else
            if state.position?
                $scope.currentPosition = state.position
            if theTrack?.duration_ms
                $scope.duration = theTrack.duration_ms
        updateProgress()

        # Start/stop progress timer based on playback state
        if $scope.playing
            startProgressTimer()
        else
            stopProgressTimer()

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

    $scope.$watch 'currentVolume', (newValue, oldValue) ->
        if newValue != oldValue and $scope.trackName
            utils.send 'spotify action', { action: 'setVolume', value: (newValue / 100) }

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