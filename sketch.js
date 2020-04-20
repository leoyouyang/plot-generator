let database, ref, plots, keys;
let qtyText, qty;
let locationText, characterText, actionText, moodText, creditsText;
let locationInputBox, characterInputBox, actionInputBox, moodInputBox, usernameInputBox;
let submitStatusText;
let pLocation = '<br>';
let pCharacter = '<br>';
let pAction = '<br>';
let pMood = '<br>';
let pCredits = '<br><br>';

function setup() {
  noCanvas();
  setupFirebase();
  pageElements();
}

function pageElements() {
  createElement('h1', 'Plot Generator');

  //Placeholder for current number of submissions
  qtyText = createP('<br>');

  //Generate a plot
  createP('<hr>Location');
  locationText = createSpan(pLocation);
  createP('<hr>Character');
  characterText = createSpan(pCharacter);
  createP('<hr>Action');
  actionText = createSpan(pAction);
  createP('<hr>Mood');
  moodText = createSpan(pMood);
  createSpan('<hr>Credits<br>');
  creditsText = createSpan(pCredits);
  createP('<hr>');
  createButton('Generate').mousePressed(generatePlot);
  locationText.class('content');
  characterText.class('content');
  actionText.class('content');
  moodText.class('content');
  creditsText.class('credits');

  //Submit a plot
  createElement('h3', '<hr>Submit your own plot here!');
  locationInputBox = createInput().attribute('placeholder', 'Location');
  characterInputBox = createInput().attribute('placeholder', 'Character');
  createSpan('<br>');
  actionInputBox = createInput().attribute('placeholder', 'Action');
  moodInputBox = createInput().attribute('placeholder', 'Mood');
  createSpan('<br>');
  usernameInputBox = createInput().attribute('placeholder', 'Your Name');
  submitStatusText = createSpan('<br><br>');
  submitStatusText.class('submit-status');
  createButton('Submit').mousePressed(submitPlot);
}

function gotData(data) {
  plots = data.val();
  keys = Object.keys(plots);
  qty = keys.length;
  qtyText.html('Current number of submissions: ' + qty);

  // for (let i = 0; i < qty; i++) {
  //   let k = keys[i];
  //   let klocation = plots[k].location;
  // }
}

function errData(err) {
  console.log('Error! <br>' + err);
}

function generatePlot() {
  //Get data from Firebase
  let randLocationKey = keys[int(random(0, qty))];
  let randCharacterKey = keys[int(random(0, qty))];
  let randActionKey = keys[int(random(0, qty))];
  let randMoodKey = keys[int(random(0, qty))];
  pLocation = plots[randLocationKey].location;
  pCharacter = plots[randCharacterKey].character;
  pAction = plots[randActionKey].action;
  pMood = plots[randMoodKey].mood;
  let pLocationCredit = plots[randLocationKey].username;
  let pCharacterCredit = plots[randCharacterKey].username;
  let pActionCredit = plots[randActionKey].username;
  let pMoodCredit = plots[randMoodKey].username;
  pCredits = 'Location: ' + capitalLetter(pLocationCredit) +
             ' &nbsp;&nbsp; Character: ' + capitalLetter(pCharacterCredit) +
             '<br>Action: ' + capitalLetter(pActionCredit) +
             ' &nbsp;&nbsp; Mood: ' + capitalLetter(pMoodCredit);
  locationText.html(capitalLetter(pLocation));
  characterText.html(capitalLetter(pCharacter));
  actionText.html(capitalLetter(pAction));
  moodText.html(capitalLetter(pMood));
  creditsText.html(pCredits);
}

function submitPlot() {
  //Check if all the fields have been filled
  if (locationInputBox.value() == '' || characterInputBox.value() == '' || actionInputBox.value() == '' || moodInputBox.value() == '' || usernameInputBox.value() == '') {
    submitStatusText.html('<br>Please fill in all the fields.<br>');
  }

  else {
    //Submit to Firebase
    let data = {
      username: usernameInputBox.value(),
      location: locationInputBox.value(),
      character: characterInputBox.value(),
      action: actionInputBox.value(),
      mood: moodInputBox.value()
    }
    ref.push(data);

    //Reset the text boxs
    submitStatusText.html('<br>Done!<br>');
    locationInputBox.value('');
    characterInputBox.value('');
    actionInputBox.value('');
    moodInputBox.value('');
    usernameInputBox.value('');
    locationInputBox.attribute('placeholder', 'Location');
    characterInputBox.attribute('placeholder', 'Character');
    actionInputBox.attribute('placeholder', 'Action');
    moodInputBox.attribute('placeholder', 'Mood');
    usernameInputBox.attribute('placeholder', 'Your Name');
  }
}

function capitalLetter(str) {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}

function setupFirebase() {
  database = firebase.database();
  ref = database.ref('plots');
  ref.on('value', gotData, errData);
}
