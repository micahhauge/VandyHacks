// global stuff
TweenLite.defaultEase = Linear.easeNone;
// the pitch value of all black notes
var blackNotes = [1,4,6,9,11,13,16,18,21,23,25,28,30,33,35,37,40,42,45,47,49,52,54,57,59,61,64,66,69,71,73,76,78,81,83,85];

// array where each index corresponds to a pitch, and the value at each index is the corresponding Xpos value
var pitchToXPos = [0,1,1,2,3,3,4,4,5,6,6,7,7,8,8,9,10,10,11,11,12,13,13,14,14,15,15,16,17,17,18,18,19,20,20,21,21,22,22,23,24,24,25,25,26,27,27,28,28,29,29,30,31,31,32,32,33,34,34,35,35,36,36,37,38,38,39,39,40,41,41,42,42,43,43,44,45,45,46,46,47,48,48,49,49,50,50,51];


// define noter role object
function NoteRoll () {
  this.notes = [];
  this.keys = [];
  this.p = getProperties();
  this.playingNotes = [88];
  this.startNotes = [];
  this.recording = false;
  this.globalStartTime = null;

  this.createKeys = function () {
    var keys = [];
    for (var i = 0; i < 88; i++) {
      keys.push(new KeyGraphic(i, p));
    }
    return keys;
  }

  this.keys = this.createKeys();

  this.playNote  = function (pitch, velocity) {
    var note = new LiveNote(pitch, new Date(), null, velocity);
    note.startTime = new Date();
    note.graphic =  new createNoteGraphic();
    var x, y, width, height;


    if (isBlack(pitch)) {
      x = pitchToXPos[pitch] * p.noteWidth - .3 * p.noteWidth;
      width = p.noteWidth * .6;
    } else {
      x = pitchToXPos[pitch] * p.noteWidth;
      width = p.noteWidth;
    }

    document.body.appendChild(note.graphic);
    this.playingNotes[pitch] = note;
    // this.playingNotes.push(note);
    TweenLite.to(note.graphic, 0, {
      x: x,
      y: p.viewHeight,
      width: width,
      height: 3000,
      backgroundColor: note.noteColor,
    });

    note.tl.to(note.graphic, p.noteSpeed, {
      y: 0,
    });
  }

  this.stopNote = function (pitch) {
    var note = this.playingNotes[pitch];
    note.stopTime = new Date();
    note.duration = (note.stopTime - note.startTime) / 1000;
    // change he height of note to proper length
    TweenLite.to(this.playingNotes[pitch].graphic, 0, {
      height: note.duration * this.p.yScale,
    });

    // animate the note off the screen
    note.tl.to(note.graphic, note.duration, {
      y: 0 - note.duration * this.p.yScale,
    });

    note.tl.call(function () {
      document.body.removeChild(note.graphic);
    })


    if (this.recording) {
      this.notes.push(new Note(pitch, (note.startTime - this.globalStartTime) / 1000, note.duration, note.velocity))
      console.log('added note');
    }
  }

  this.exportNotes = function () {
    var noteInfo = this.notes;
    console.log(this.notes);

    // TODO : send this string to the backend as a JSON
    var objStr = JSON.stringify(noteInfo);
	// SAVING MIDI IN TMP FILE
	saveMidi(objStr,'tmp');
	// THIS IS HOW TO LOAD THE FILE BACK
	// loadMidi('tmp')
  }
}


function Note(pitch, startTime, duration, velocity) {
  this.pitch = pitch;
  this.startTime = startTime;
  this.duration = duration;
  this.velocity = velocity;
  this.graphic = null;
  // this.noteColor = getRandomColor();

  if (this.velocity < .1) {
    this.noteColor = "#4EDC54";
  } else if (this.velocity < .15){
      this.noteColor = "#55DC4E";
  } else if (this.velocity < .2) {
    this.noteColor = "#5edc4e";
  } else if (this.velocity < .25) {
    this.noteColor = "#65dc4e";
  } else if (this.velocity < .3) {
    this.noteColor = "#6edc4e";
  } else if (this.velocity < .35) {
    this.noteColor = "#75dc4e";
  } else if (this.velocity < .4) {
    this.noteColor = "#7edc4e";
  } else if (this.velocity < .45) {
    this.noteColor = "#85dc4e";
  } else if (this.velocity < .5) {
    this.noteColor = "#8edc4e";
  } else if (this.velocity < .55) {
    this.noteColor = "#95dc4e";
  } else if (this.velocity < .6) {
    this.noteColor = "#9edc4e";
  } else if (this.velocity < .65){
    this.noteColor = "#a5dc4e";
  } else if (this.velocity < .7) {
    this.noteColor = "#aedc4e";
  } else if (this.velocity < .75) {
    this.noteColor = "#bedc4e";
  } else if (this.velocity < .8) {
    this.noteColor = "#d5dc4e";
  } else if (this.velocity < .85) {
    this.noteColor = "#eec54e";
  } else if (this.velocity < .9) {
    this.noteColor = "#eead4e";
  } else if (this.velocity < .95) {
    this.noteColor = "#ee7e4e";
  } else {
    this.noteColor = "#ee5f4e";
  }


  this.initialX = null;
  this.len = null;


  // animation properties
  this.getAnimationProperties = function(p) {
    this.initialX = pitchToXPos[this.pitch] * p.noteWidth;
    this.len = this.duration * p.yScale;
  }

  // this.stopTime = startTime + noteSpeed;

}


function LiveNote(pitch, startTime, duration, velocity, graphic = null) {
  this.pitch = pitch;
  this.startTime = startTime;
  this.duration = duration;
  this.velocity = velocity;
  this.graphic = null;
  this.tl = new TimelineMax();
  // this.noteColor = getRandomColor();
  if (this.velocity < .1) {
    this.noteColor = "#4EDC54";
  } else if (this.velocity < .15){
      this.noteColor = "#55DC4E";
  } else if (this.velocity < .2) {
    this.noteColor = "#5edc4e";
  } else if (this.velocity < .25) {
    this.noteColor = "#65dc4e";
  } else if (this.velocity < .3) {
    this.noteColor = "#6edc4e";
  } else if (this.velocity < .35) {
    this.noteColor = "#75dc4e";
  } else if (this.velocity < .4) {
    this.noteColor = "#7edc4e";
  } else if (this.velocity < .45) {
    this.noteColor = "#85dc4e";
  } else if (this.velocity < .5) {
    this.noteColor = "#8edc4e";
  } else if (this.velocity < .55) {
    this.noteColor = "#95dc4e";
  } else if (this.velocity < .6) {
    this.noteColor = "#9edc4e";
  } else if (this.velocity < .65){
    this.noteColor = "#a5dc4e";
  } else if (this.velocity < .7) {
    this.noteColor = "#aedc4e";
  } else if (this.velocity < .75) {
    this.noteColor = "#bedc4e";
  } else if (this.velocity < .8) {
    this.noteColor = "#d5dc4e";
  } else if (this.velocity < .85) {
    this.noteColor = "#eec54e";
  } else if (this.velocity < .9) {
    this.noteColor = "#eead4e";
  } else if (this.velocity < .95) {
    this.noteColor = "#ee7e4e";
  } else {
    this.noteColor = "#ee5f4e";
  }
  
  this.initialX = null;
  this.len = null;


  // animation properties
  this.getAnimationProperties = function(p) {
    this.initialX = pitchToXPos[this.pitch] * p.noteWidth;
    this.len = this.duration * p.yScale;
  }

  // this.stopTime = startTime + noteSpeed;

}


// Function to create a key object
function KeyGraphic (pitch, p) {
  var div = document.createElement('div');
  div.className = "key";
  document.body.appendChild(div);


  if (isBlack(pitch)) {
    this.keyColor = "black";
    TweenLite.set(div, {
      x: pitchToXPos[pitch] * p.noteWidth - .4 * p.noteWidth,
      y: p.viewHeight,
      width: p.noteWidth * .75,
      height: p.keyHeight * .6,
      backgroundColor: 'black',
      zIndex: 10,
    });
  } else {
    this.keyColor = "white";
    TweenLite.set(div, {
      x: pitchToXPos[pitch] * p.noteWidth,
      y: p.viewHeight,
      width: p.noteWidth,
      height: p.keyHeight,
    });
  }
  this.graphic = div;



  return this;
}

// function to create noteGraphic objects
function createNoteGraphics (numberOfGraphics) {
  // array to hold the noteGraphics
  var noteGraphics = [];

  // fills the array with empty divs and adds the divs to the dom
  for (i = 0; i < numberOfGraphics; i++) {
    var div = document.createElement('div');
    div.className = "note";
    document.body.appendChild(div);
    noteGraphics.push(div);
  }

  return(noteGraphics);
}

function createNoteGraphic () {
  var div = document.createElement('div');
  div.className = "note";
  return div;
}

// function to get properties that are essential to the game
// returns an object (effectively an associative array) containing all the required properties
function getProperties () {
  // p is the object that conatins the properties
  p = {};

  // dimentions of the game view
  p.viewWidth = window.innerWidth;
  // establish noteWidth based on viewWidth so that application is scalable
  p.noteWidth = p.viewWidth / 52;
  p.keyHeight = 5 * p.noteWidth;
  p.viewHeight = window.innerHeight - p.keyHeight;
  p.viewCenter = p.viewWidth / 2;


  // the time in seconds that it will take a note to cross the sceen
  p.noteSpeed = 3;

  // yScale is the number of vertical pixels that represent 1 second in game
  // so if a note is 3 seconds long, it's vertical height will be 3 * yScale pixels
  p.yScale = p.viewHeight / p.noteSpeed;

  return p;
}

// function to determine if a key is white or blackNote
function isBlack(pitch) {
  // if the note is black
  if (blackNotes.indexOf(pitch) != -1) {
    return true;
    // alert('hi');
  } else {
    return false;
  }
}
