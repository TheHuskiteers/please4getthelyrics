// var fs = require('fs')
// var jsonLyricFile = fs.readFileSync(__dirname + '/karson/2KH16WveTQWT6KOG9Rg6e2.json', 'utf-8')

// jsonLyrics = JSON.parse(jsonLyricFile)
/*
FOR USE WITH THE gameSpace html.
*/

const lyricBox = document.getElementById('lyrics')

function inputJSONLyrics (lyricBox, JSONClip) {
  const initialTime = JSONClip[0].timestamp
  let currentLine = false
  const currentBox = false
  let prevSyl = false
  let prevSylBlock = false
  let syl
  for (syl of JSONClip) {
    if (currentLine == false) { // If the first slashes, add the paragraph.
      currentLine = document.createElement('P')
      lyricBox.appendChild(currentLine)
      currentLine.classList.add('lyricLine')
    }
    if (syl.lyric == '/') { // Start the next Line.
      currentLine = document.createElement('P')
      lyricBox.appendChild(currentLine)
      currentLine.classList.add('lyricLine')
    } else if (syl.lyric == '\\') {
      break
    } else if (syl.lyric == '_') {
      currentSylBlock = document.createElement('SPAN')
      currentLine.appendChild(currentSylBlock)
      currentSylBlock.classList.add('mysteryLyric')
    } else {
      currentSylBlock = document.createElement('SPAN')
      currentLine.appendChild(currentSylBlock)
      currentSylBlock.classList.add('lyric')
      currentSylBlock.innerHTML = syl.lyric
      currentSylBlock.style.animationPlayState = 'paused'
      currentSylBlock.style.animationDelay = (syl.timestamp - initialTime) + 's'
      if (prevSyl) {
        prevSylBlock.style.animationDuration = syl.timestamp - prevSyl.timestamp + 's'
      }
      prevSyl = syl
      prevSylBlock = currentSylBlock
    }
    // Assume its a syllable.
  }
}

function playLyrics (lyricBox) {
  spans = lyricBox.getElementsByClassName('lyric')
  console.log(spans)
  for (syl of spans) {
    syl.style.animationPlayState = 'running'
  }
}

function emptyLyrics (lyricBox) {
  lyricBox.innerHTML = ''
}

function getRoundLyrics (lyricData) {
  // TODO: Game difficulty: prioritize chorus for easy, verse 1 for normal, verse 2 for hard.
  // Pick a section fully randomly
  const musicSection = shuffle(lyricData)[0]
  // Pick a \\, keep adding until the next \\.
  const newSectionIndicies = []
  for (i in musicSection) {
    if (musicSection[i].lyric == '\\' || i <= musicSection.length - 5) {
      newSectionIndicies.push(i)
    }
  }
  const startingIndex = shuffle(newSectionIndicies)[0]
  const finalSection = []
  for (let i = startingIndex; i < length(musicSection) || musicSection[i].lyric != '\\'; i++) {
    finalSection.push(musicSection[i])
  }

  return finalSection
}

// let exampleJSONClip = [ { timestamp: 84.19178010391235, lyric: '\\' },
// { timestamp: 84.19179010391235, lyric: 'It\'s' },
// { timestamp: 84.56093621253967, lyric: ' the' },
// { timestamp: 85.24672412872314, lyric: ' eye' },
// { timestamp: 85.56567406654358, lyric: ' of' },
// { timestamp: 85.80191421508789, lyric: ' the' },
// { timestamp: 85.96275019645691, lyric: ' ti' },
// { timestamp: 86.41278100013733, lyric: 'ger,' },
// { timestamp: 86.67693614959717, lyric: ' it\'s' },
// { timestamp: 86.92712903022766, lyric: ' the' },
// { timestamp: 87.2083580493927, lyric: ' cream' },
// { timestamp: 87.48352599143982, lyric: ' of' },
// { timestamp: 87.75804209709167, lyric: ' the' },
// { timestamp: 88.01457619667053, lyric: ' fight' },
// { timestamp: 88.54184009002685, lyric: '/' },
// { timestamp: 88.54185009002686, lyric: 'Ri' },
// { timestamp: 88.96344804763794, lyric: 'sin\'' },
// { timestamp: 89.39195704460144, lyric: ' up' },
// { timestamp: 89.93372511863708, lyric: ' to' },
// { timestamp: 90.18034410476685, lyric: ' the' },
// { timestamp: 90.49999403953552, lyric: ' chal' },
// { timestamp: 90.78736400604248, lyric: 'lenge' },
// { timestamp: 91.03744912147522, lyric: ' of' },
// { timestamp: 91.15022420883179, lyric: ' our' },
// { timestamp: 91.59491515159607, lyric: ' ri' },
// { timestamp: 92.16439914703369, lyric: 'val' },
// { timestamp: 92.86435605453491, lyric: '\\' }
// ]
// let exampleJSONClip2 = [{
//   "timestamp": 19.32179905342102,
//   "lyric": "\\"
// }, {
//   "timestamp": 19.32180905342102,
//   "lyric": "We're"
// }, {
//   "timestamp": 19.573330879211426,
//   "lyric": " no"
// }, {
//   "timestamp": 19.822540044784546,
//   "lyric": " stran"
// }, {
//   "timestamp": 20.058934926986694,
//   "lyric": "gers"
// }, {
//   "timestamp": 20.338863849639893,
//   "lyric": " to"
// }, {
//   "timestamp": 20.595873832702637,
//   "lyric": " love"
// }, {
//   "timestamp": 23.267555965652466,
//   "lyric": "/"
// }, {
//   "timestamp": 23.267565965652466,
//   "lyric": "You"
// }, {
//   "timestamp": 23.539275884628296,
//   "lyric": " know"
// }, {
//   "timestamp": 23.806144952774048,
//   "lyric": " the"
// }, {
//   "timestamp": 24.074102878570557,
//   "lyric": " rules,"
// }, {
//   "timestamp": 24.828675985336304,
//   "lyric": " and"
// }, {
//   "timestamp": 25.117743968963623,
//   "lyric": " so"
// }, {
//   "timestamp": 25.64487385749817,
//   "lyric": " do"
// }, {
//   "timestamp": 25.90944790840149,
//   "lyric": " I"
// }, {
//   "timestamp": 27.532735838165284,
//   "lyric": "/"
// },{
//   "timestamp": 27.532745838165283,
//   "lyric": "A"
// }, {
//   "timestamp": 27.780645847320557,
//   "lyric": " full"
// }, {
//   "timestamp": 28.051333904266357,
//   "lyric": " com"
// }, {
//   "timestamp": 28.297557830810547,
//   "lyric": "mit"
// }, {
//   "timestamp": 28.54660701751709,
//   "lyric": "ment's"
// }, {
//   "timestamp": 28.834661960601807,
//   "lyric": " what"
// }, {
//   "timestamp": 29.096529960632324,
//   "lyric": " I'm"
// }, {
//   "timestamp": 29.651861906051636,
//   "lyric": " think"
// }, {
//   "timestamp": 29.912937879562378,
//   "lyric": "ing"
// }, {
//   "timestamp": 30.150768041610718,
//   "lyric": " of"
// }, {
//   "timestamp": 31.733387006988526,
//   "lyric": "/"
// }, {
//   "timestamp": 31.733397006988525,
//   "lyric": "You"
// }, {
//   "timestamp": 32.01735186576843,
//   "lyric": " would"
// }, {
//   "timestamp": 32.27930402755737,
//   "lyric": "n't"
// }, {
//   "timestamp": 32.53951096534729,
//   "lyric": " get"
// }, {
//   "timestamp": 32.7950599193573,
//   "lyric": " this,"
// }, {
//   "timestamp": 33.05681085586548,
//   "lyric": " from"
// }, {
//   "timestamp": 33.62209486961365,
//   "lyric": " a"
// }, {
//   "timestamp": 33.86240887641907,
//   "lyric": "ny"
// }, {
//   "timestamp": 34.11643600463867,
//   "lyric": " o"
// }, {
//   "timestamp": 34.37157702445984,
//   "lyric": "ther"
// }, {
//   "timestamp": 34.62236499786377,
//   "lyric": " guy"
// }]
// inputJSONLyrics(lyricBox,exampleJSONClip2);
// playLyrics(lyricBox);
// textFiles = document.getElementsByClassName("lyric");
// for(let i = 0; i < textFiles.length; i++){
//   textFiles[i].style.animationDelay = (i * .25) + "s";
// }
