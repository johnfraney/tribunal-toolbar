var currentGame;
var currentGameDiv;
var clickedFilter;
var theId;
var boldSum = [];
var hasOverlay = false;
var badWords = [
        'ass',
        'awful',
        'bad',
        'balls',
        'bitch',
        'btch',
        'bch',
        'bots',
        'butt',
        'cock',
        'cunt',
        'dick',
        'd1ck',
        'dik',
        'douche',
        'downer',
        'downs',
        'dumb',
        'fag',
        'fgt',
        'fail',
        'feed',
        'aff',
        'eff',
        'fuc',
        'fck',
        'fack',
        'fkd',
        'fkn',
        'fuk',
        'fk',
        'fuu',
        'garbage',
        'gay',
        'gey',
        'hell',
        'homo',
        'h0m0',
        'horri',
        'idiot',
        'jew',
        'umad',
        'mierd',
        'mom',
        'golico',
        'moron',
        'nazi',
        'nig',
        'n1g',
        'igger',
        'nigra',
        'n00b',
        'noob',
        'ooob',
        'nub',
        'newb',
        'omfg',
        'own',
        'puta',
        'pwn',
        'pown',
        'p0wn',
        '0wn',
        'pansy',
        'pelotud',
        'penis',
        'pe.nis',
        'piss',
        'puss',
        'pusy',
        'queer',
        'qq',
        'rape',
        'r@pe',
        'retard',
        'screw',
        'scrub',
        'shit',
        'shiet',
        'sht',
        'mierda',
        'slut',
        'stupid',
        'stuppid',
        'stfu',
        'suck',
        'trash',
        'troll',
        'twat',
        'uninstall',
        'unistall',
        'useless',
        'wth',
        'wtf'
];

function keydown(e) {
        elType = document.activeElement.tagName.toLowerCase();
        if (elType == 'textarea' || elType == 'input') {
                return;
        }
        key = e.keyCode;
        if (e.ctrlKey == false) {
                if (key == 27 && hasOverlay == true) { // esc
                        hide_help();
                }
                if (key == 49) { // 1
                        view_game(1);
                }
                if (key == 50) { // 2
                        view_game(2);
                }
                if (key == 51) { // 3
                        view_game(3);
                }
                if (key == 52) { // 4
                        view_game(4);
                }
                if (key == 53) { // 5
                        view_game(5);
                }
                if (key == 82) { // r
                    if (e.shiftKey == false && e.ctrlKey == false && e.metaKey == false) {
                            init();
                    }
                }
                if (key == 191) { // ?
                        if (e.shiftKey == true && hasOverlay == false) {
                                show_help();
                        }
                        else if (e.shiftKey == true && hasOverlay == true) {
                                hide_help();
                        }
                }
        }
}

var dispatchEvent = function (elt, name) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(name, true, true);
        elt.dispatchEvent(clickEvent);
};

function get_current_game() {
    theGames = document.getElementsByClassName('tab-content');
    for (i=0; i<theGames.length; i++) {
        if (theGames[i].style.display != 'none') {
           currentGame = theGames[i].id;
           currentGameDiv = document.getElementById(currentGame);
        }
    }
}

function bold_bad_words() {
        boldSum = 0;
        boldedCount = 0;
        chatBox = currentGameDiv.getElementsByClassName('chat-log')[0];
        bCount = chatBox.getElementsByTagName('b').length;
        if (bCount < 1) {
                theDivs = chatBox.getElementsByTagName('div');
                for (i=0; i<theDivs.length; i++) {
                        chatSpan = theDivs[i].getElementsByClassName('chat-message')[0];
                        spanText = chatSpan.innerHTML.split(' ');
                        for (x=0; x<spanText.length; x++) {
                                theWord = spanText[x];
                                for (y=0; y<badWords.length; y++) {
                                        badWord = badWords[y];
                                        theWordLower = theWord.toLowerCase();
                                        if (theWordLower.indexOf(badWord) > -1) {
                                                spanText[x] = '<b>' + theWord + '</b>';
                                        }
                                }
                        }
                        newChatSpan = spanText.join(' ');
                        chatSpan.innerHTML = newChatSpan;
                }
        }
        // Get number of flagged words used by reported player
        reportedDivs = chatBox.getElementsByClassName('reported-player');
        for (i=0; i<reportedDivs.length; i++) {
            thisDiv = reportedDivs[i];
            boldedWords = thisDiv.getElementsByTagName('b');
            boldedCount = boldedWords.length;
            boldSum += boldedCount;
        }
        document.getElementById('langTotal').innerHTML = boldSum;
}

function get_kda() {
        kda = currentGameDiv.getElementsByClassName('player-kda')[0];
        if (kda == undefined) {
            setTimeout(get_kda, 1000);
        }
        else {
            scoreSum = document.getElementById('scoreSum');
            scoreSum.innerHTML = 'KDA: ' + kda.innerHTML;
        }
}

function get_report_types() {
        reportTypes = [];
        reportText = '';
        reportDivs = currentGameDiv.getElementsByClassName('report-reason');
        for (i=0; i<reportDivs.length; i++) {
                reportText = reportDivs[i].innerHTML;
                if (reportTypes.indexOf(reportText) == -1) {
                        reportTypes.push(reportText);
                }
        }
        reportTypes = reportTypes.join(', ');
        document.getElementById('reportTypes').innerHTML = reportTypes;
}

function add_reported_filter() {
        gameNum = currentGame.replace('game', '');
        if (document.getElementById('chat-filter-reported-' + gameNum) == null) {
                reportedFilter = document.createElement('li');
                reportedFilter.innerHTML = '<input type="radio" name="chat-filter-' + gameNum + '" id="chat-filter-reported-' + gameNum + '" />\
                                            <label for="chat-filter-reported-' + gameNum + '">Reported Player</label>';
                reportedFilter.getElementsByTagName('input')[0].onchange = filter_reported_chat;
                chatFilterUl = currentGameDiv.getElementsByClassName('chat-filters')[0];
                chatFilterUl.appendChild(reportedFilter);
                otherLi = chatFilterUl.getElementsByTagName('li')[1];
                theLiInput = otherLi.getElementsByTagName('input')[0];
                liName = theLiInput.getAttribute('name');
                filterInput = reportedFilter.getElementsByTagName('input')[0];
                filterInput.setAttribute('name', liName);
        }
        else {
            return;
        }
}
function filter_reported_chat() {
        chatBox = currentGameDiv.getElementsByClassName('chat-log')[0];
        theDivs = chatBox.getElementsByTagName('div');
        for (i=0; i<theDivs.length; i++) {
                theDivs[i].style.display = 'block';
                check = theDivs[i].className;
                if (check.indexOf('reported-player') < 0) {
                        theDivs[i].style.display = 'none';
                }
        }
}

function show_help() {
        if (hasOverlay == true) return;
        overBg = document.createElement('div');
        overBg.id = 'overBg';
        overBg.style.width = '100%';
        overBg.style.height = '100%';
        overBg.style.position = 'fixed';
        overBg.style.top = '0%';
        overBg.style.left = '0%';
        overBg.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overBg.zIndex = '1002';
        overBg.onclick = hide_help;
        
        helpOver = document.createElement('div');
        helpOver.id = 'helpOver';
        helpOver.style.width = '50%';
        helpOver.style.height = '50%';
        helpOver.style.padding = '15px';
        helpOver.style.position = 'fixed';
        helpOver.style.top = '25%';
        helpOver.style.left = '25%';
        helpOver.style.zIndex = '1003';
        helpOver.style.textAlign = 'left';
        helpOver.style.backgroundColor = '#FCF4D7';
        helpOver.style.border = '1px solid #EBD3B4';
        helpOver.style.borderRadius = '5px';
        helpOver.innerHTML = '<h3 class="judger_header">League of Legends Tribunal Assistant Help</h3> \
                             <h2>Toolbar</h2> \
                             <p>The toolbar at the top of this page provides some information that will help you make an informed and swift judgement. The toolbar consists of three parts:</p> \
                             <ol> \
                             <li>The reported player\'s KDA (Kills/Deaths/Assists);</li> \
                             <li>The reson(s) that player was reported; and</li> \
                             <li>The number of possible curses, griefs, and taunts the reported player entered in chat.</li> \
                             </ol> \
                             <h2>Keyboard Shortcuts</h2> \
                             <ul> \
                             <li><strong>?</strong>: Show/hide help popup</li> \
                             <li><strong>Esc</strong>: Hide help popup</li> \
                             <li><strong>r</strong>: Reload the toolbar (if it isn\'t working properly, say)</li> \
                             <li><strong>1-5</strong>: Load game 1-5</li> \
                             </ul>';
        
        document.body.appendChild(overBg);
        document.body.appendChild(helpOver);
        
        hasOverlay = true;
}

function hide_help() {
        theOverBg = document.getElementById('overBg');
        document.body.removeChild(theOverBg);
        
        theHelpOver = document.getElementById('helpOver');
        document.body.removeChild(theHelpOver);
        hasOverlay = false;
}


function view_game(gameNum) {
        theGameLink = document.getElementById(gameNum);
        dispatchEvent(theGameLink, 'click');
        init();
}

function create_toolbar() {
        theToolbar = document.getElementById('toolbar');
        if (theToolbar != null) {
            theToolbar.parentNode.removeChild(theToolbar);
        }
        toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        toolbar.style.paddingBottom = '5px';
        toolbar.style.fontFamily = 'Arial,Helvetica,sans-serif';
        toolbar.style.fontSize = '14px';
        toolbar.style.color = 'rgb(240, 240, 240)';
        toolbar.style.textShadow = '1px 1px 1px #777';
        toolbar.style.backgroundColor = 'rgb(22, 22, 22)';
        toolbar.style.boxShadow = '1px 1px 5px #333';
        toolbar.style.clear = 'both';
        
        separator = document.createElement('span');
        separator.style.margin = '0 10px';
        separator.style.borderRight = '1px #fff solid';
        separator.style.outline = '1px #555 solid';
        
        scoreSum = document.createElement('span');
        scoreSum.innerHTML = '<span id="scoreSum" title="Kills/Deaths/Assists"></span>';
        
        reportSum = document.createElement('span');
        reportSum.innerHTML = '<span id="reportTypes" title="Reason(s) for Reporting"></span>';
        
        languageSum = document.createElement('span');
        languageSum.innerHTML = '<span title="Possible Number of Offensive/Rude Words Used">Flagged Words: <span id="langTotal"></span></span>';
        
        toolbar.appendChild(scoreSum);
        toolbar.appendChild(separator);
        
        toolbar.appendChild(reportSum);
        toolbar.appendChild(separator.cloneNode(false));
        
        toolbar.appendChild(languageSum);
        
        try {
                document.getElementById('lol-pvpnet-bar').appendChild(toolbar);
        }
        catch(err) {
                setTimeout(create_toolbar(), 1000);
        }
}
function init() {
        create_toolbar();
        get_current_game();
        bold_bad_words();
        get_kda();
        get_report_types();
        add_reported_filter();
}
window.addEventListener('load', init, false);
window.addEventListener('keydown', keydown, false);

theTool = document.getElementById('toolbar');
if (theTool == undefined) {
        setTimeout(init, 1000);
}

// Clicking pardon, punish, skip doesn't reload the toolbar, but it does get every other function ready. Maybe I can just check for the toolbar every 2 seconds or so and then create it if necessary.
