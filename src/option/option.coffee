import $ from 'jquery'
import utils from "utils"
import '../vendor/needsharebutton.min.js'
import '../vendor/needsharebutton.min.css'
import '../vendor/github-badge.js'

if utils.isFirefox()
    $('#open-shortcuts').remove()
else
    $('#open-shortcuts').on 'click', () -> 
        utils.send 'open options shortcuts'
        return false
    $('#how-to-open-shortcuts').remove()    
    
if location.search.includes('needAutoPlay') and utils.isFirefox()
    $('#need-auto-play').show()
else 
    $('#need-auto-play').remove()
