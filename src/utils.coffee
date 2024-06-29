export default {
    getRandomInt: (min, max)->
        min ?= 1
        max ?= 10
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min

    extraKeyMap: {
        Enter: 13,
        Space: 32,
        Tab: 9,
        End: 35,
        Home: 36,
        PageDown: 34,
        PageUp: 33,
        ArrowDown: 40,
        ArrowLeft: 37,
        ArrowRight: 39,
        ArrowUp: 38,
        Escape: 27,
    }
    checkEventKey: (event, sk1, sk2, key)->
        if key == 'Disabled'
            return false
        if sk1 and not event[sk1.toLowerCase() + 'Key']
            return false
        if sk2 and not event[sk2.toLowerCase() + 'Key']
            return false
        if @extraKeyMap[key]
            if event.keyCode != @extraKeyMap[key]
                return false

        else if key and event.keyCode != key.charCodeAt(0)
            return false

        return true

    promisify: (cb) ->
        new Promise (resolve) ->
            cb resolve
    
    promisifiedTimeout: (t) ->
        new Promise (resolve) ->
            setTimeout resolve, t
    
    checkInTime: (func, t=5000) ->
        timeIsUp = false 
        @promisifiedTimeout(t).then ()->
            timeIsUp = true 

        _check = () =>
            new Promise (resolve, reject) =>
                await @promisifiedTimeout(500)
                if func()
                    resolve()
                else if timeIsUp
                    reject() 
                else 
                    return _check().then(resolve, reject)
        
        return await _check()
            
    send: (type, data = {}, callback) ->
        if typeof data == 'function'
            callback = data
            data = {}

        p = new Promise (resolve) ->
            data.type = type
            chrome.runtime?.sendMessage data, resolve

        if callback
            return p.then callback
        return p

    sendToDict: (action, callback) ->
        return @send 'sendToDict', { action }, callback

    hasJapanese: (str) ->
        REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/
        REGEX_JAPANESE.test(str)
    isJapanese: (str) ->
        jregex = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/g
        str.match(jregex)?.length == str.length

    hasChinese: (str) ->
        REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u
        REGEX_CHINESE.test(str)
    isChinese: (str) ->
        cregex = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/ug
        str.match(cregex)?.length == str.length

    hasEnglish: (str) ->
        /\w/.test(str)

    isEnglish: (str)->
        # match: I'll  don't  Mr.Jackson
        REGEX_ENG = /[a-zA-Z\s-]+[’'.]?[a-zA-Z\s-]+/
        return str.match(REGEX_ENG)?[0] == str

    isLinux: () -> 
        return window.navigator.platform.includes('Linux')
    isFirefox: () -> 
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    
    isEdge: () -> 
        return navigator.userAgent.toLowerCase().indexOf('edge') > -1
    
    getBrowserName: () ->
        if navigator.userAgent.toLowerCase().indexOf('firefox') > -1
            return 'Firefox'
        if navigator.userAgent.toLowerCase().indexOf('edge') > -1
            return 'Edge'
        if navigator.userAgent.toLowerCase().indexOf('chromium') > -1
            return 'Chromium'
        if navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1
            return 'Safari'
        if navigator.userAgent.toLowerCase().indexOf('opera') > -1
            return 'Opera'
        if navigator.userAgent.toLowerCase().indexOf('chrome') > -1
            return 'Chrome'
        
        return 'Browser'

    sanitizeHTML: (s)->
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
