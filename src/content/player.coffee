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
refreshTooltips = (selector, label, showImmediately = false) ->
    setTimeout ->
        # Only initialize tooltips that haven't been initialized yet
        $('[data-toggle="tooltip"]:not([data-original-title])').tooltip()
        if selector
            $(selector).each (index, el) ->
                updatedLabel = label or $(el).attr('title') or $(el).attr('data-original-title')
                if updatedLabel
                    $(el).attr('data-original-title', updatedLabel)
                    $(el).attr('title', '')  # Clear original title to prevent default tooltip
                    if showImmediately
                        $(el).tooltip('show')
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
    $scope.canToggleShuffle = true
    $scope.canToggleRepeat = true
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
    currentItemType = 'track'  # 'track' or 'episode'

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
    $scope.queueNeedsReauth = false

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
        if result?.needsReauth
            $scope.queueNeedsReauth = true
            $scope.$apply() if !$scope.$$phase
        else if result?.queue
            $scope.queue = result.queue
            $scope.queueNeedsReauth = false
            $scope.$apply() if !$scope.$$phase
            refreshTooltips()

    # Playback Mode: off -> shuffle -> repeat
    $scope.playbackMode = 'off'

    $scope.togglePlaybackMode = () ->
        # Don't toggle if both shuffle and repeat are disallowed
        return if !$scope.canToggleShuffle and !$scope.canToggleRepeat
        
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

        refreshTooltips('.playback-mode-toggle', '', true)
        

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

    checkSaved = (itemId, showTooltipImmediately = false) ->
        if itemId 
            if currentItemType == 'episode'
                $scope.trackSaved = await utils.send 'checkUserSavedEpisode', { episodeId: itemId }
            else
                $scope.trackSaved = await utils.send 'checkUserSavedTrack', { trackId: itemId }
            $scope.savingTrack = false
        else 
            $scope.trackSaved = false
            $scope.savingTrack = false

        $scope.$apply()
        
        label = if $scope.trackSaved then 'Unlike' else 'Like'
        refreshTooltips('.saved-track', label, showTooltipImmediately)
        

    safeFormatOpenURL = (uri) ->
        try
            return formatOpenURL uri
        catch 
            return ''

    updateState = (state) ->
        $scope.spotifyState = state 
        $scope.isSpotifyReady = state.ready
        $scope.errorLink = null

        if !state.ready
            $scope.errorMessage =  if state.accountError?.includes("premium users only") 
            then "Unfortunately this player is only possible for Spotify premium users. Please upgrade your account." 
            else state.accountError
        else if state.autoPlayError
            $scope.errorMessage = state.autoPlayError
            $scope.errorLink = chrome.runtime.getURL('option.html?needAutoPlay=1')
            console.error "auto play error", state.autoPlayError
        else if state.playError
            $scope.errorMessage = state.playError
            console.error "play error", state.playError
        else 
            # console.log "no error, state is ready."
            $scope.errorMessage = ''

        $scope.canPause = false 
        $scope.canSeekNext = false 
        $scope.canSeekPrev = false
        $scope.canToggleShuffle = true
        $scope.canToggleRepeat = true
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
            # Detect if episode or track
            currentItemType = state.currentPlaying?.currently_playing_type or theTrack.type or 
                (if theTrack.uri?.startsWith('spotify:episode:') then 'episode' else 'track')

            $scope.trackName = theTrack.name
            $scope.trackHref = safeFormatOpenURL theTrack.uri
            $scope.artistName = theTrack.artists?.map((n) -> n.name).join(', ')
            $scope.albumHref = safeFormatOpenURL theTrack.album?.uri

            checkSaved(theTrack.id)

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
            $scope.canSeekNext = !disallows.skipping_next and state.next_track?
            $scope.canSeekPrev = !disallows.skipping_prev
            $scope.canToggleShuffle = !disallows.toggling_shuffle
            $scope.canToggleRepeat = !disallows.toggling_repeat_track  
            refreshTooltips('#player-controls .control')

        $scope.currentVolume = if state.currentVolume? then state.currentVolume * 100 else $scope.currentVolume
        $scope.playing = !state.paused and state.current_track

        # Sync playback mode from state
        # repeat_mode: 0=off, 1=context, 2=track (repeat one)
        # shuffle: boolean
        # repeat_mode takes priority over shuffle
        if state.repeat_mode? or state.shuffle?
            if state.repeat_mode == 2
                $scope.playbackMode = 'repeat'
            else if state.shuffle
                $scope.playbackMode = 'shuffle'
            else
                $scope.playbackMode = 'off'

        # Get position from state or currentPlaying
        statePosition = state.position ? state.currentPlaying?.position

        # Update seekbar progress
        # Reset seekbar when track changes
        if theTrack?.id and theTrack.id != currentTrackId
            currentTrackId = theTrack.id
            $scope.currentPosition = statePosition or 0
            $scope.duration = theTrack.duration_ms or 0
        else
            # Detect track repeat: position jumped backwards significantly (more than 3 seconds)
            if statePosition? and $scope.currentPosition > 5000 and statePosition < 3000
                # Track restarted, reset and restart timer
                stopProgressTimer()
                $scope.currentPosition = statePosition
                if $scope.playing
                    startProgressTimer()
            else if statePosition?
                $scope.currentPosition = statePosition
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
            return
        # Guard disabled actions
        if action == 'previousTrack' and !$scope.canSeekPrev
            return
        if action == 'nextTrack' and !$scope.canSeekNext
            return
        utils.send 'spotify action', { action }
    
    $scope.toggleSavedTrack = () ->
        if $scope.savingTrack 
            return
        if $scope.spotifyState.current_track or $scope.spotifyState.currentPlaying?.track
            $scope.savingTrack = true
            trackId = $scope.spotifyState.current_track?.id or $scope.spotifyState.currentPlaying?.track?.id
            trackName = $scope.spotifyState.current_track?.name or $scope.spotifyState.currentPlaying?.track?.name

            if currentItemType == 'episode'
                if $scope.trackSaved 
                    res = await utils.send 'removeUserSavedEpisode', { episodeId: trackId }
                else 
                    res = await utils.send 'saveUserEpisode', { episodeId: trackId }
            else
                if $scope.trackSaved 
                    res = await utils.send 'removeUserSavedTrack', { trackId }
                else 
                    res = await utils.send 'saveUserTrack', { trackId }
                    utils.send "track saved", { trackId, trackName }

            checkSaved(trackId, true)

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

    $scope.openReauth = () ->
        # Clear tokens to force re-authorization
        await utils.send 'clear auth'
        $scope.showQueue = false
        $scope.queueNeedsReauth = false
        window.open('/authorized.html', '_blank')
        $scope.$apply()
        

    getState()
]