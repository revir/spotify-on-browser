import $ from 'jquery'
import utils from "utils"
import '../vendor/needsharebutton.min.js'
import '../vendor/needsharebutton.min.css'
import '../vendor/github-badge.js'

$('#open-shortcuts').on 'click', () -> 
    utils.send 'open options shortcuts'
    return false
