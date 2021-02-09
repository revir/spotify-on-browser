import $ from 'jquery'
import utils from "utils"
import '../vendor/needsharebutton.min.js'
import '../vendor/needsharebutton.min.css'
import '../vendor/github-badge.js'

if location.search.includes('needAutoPlay')
    $('#need-auto-play').show()
else 
    $('#need-auto-play').remove()
