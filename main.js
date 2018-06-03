let QUESTION_NUMBER = 0;
let USER_SCORE = 0;
let PASSING_SCORE = 0.8;
let QUIZ_INTRO = "Test your Microsoft Word skills!"
let SCORE_MESSAGE = `You need ${(PASSING_SCORE * 100)}% to pass. Good Luck!`
let HOMEPAGE = "https://google.com"
let API_KEY = "AIzaSyBH1StdTgi9_MIPRgwMoIPBCHZT_08qVUE";
let PASS_IMAGE = "images/fireworks.jpg"
let FAIL_IMAGE = "images/doh.jpg"

const STORE = [
  {question: "Which keyboard shortcuts allow you to change heading levels when working in Outline View?", answers: ['CTRL + Left and Right Arrows', 'TAB and SHIFT + TAB', '+ and -', "ALT + 1 and ALT + 2"], correctAnswer: 1, youTubeVideo: "_IecIjxwbvs"},
  {question: "Using Heading Styles allows you to easily generate:", answers: ["Table of Contents", "Navigation Pane", "Multi-Level Lists", "All of the above."], correctAnswer: 3, youTubeVideo: "_IecIjxwbvs"},
  {question: "To change the default Heading Style, select some text you like and then:", answers: ['Right-Click the Heading and choose "Update Heading..."', "Use CTRL + S", "Use the Layout Tab", "Just Copy and Paste over and over"], correctAnswer: 0, youTubeVideo: "_IecIjxwbvs"},
  {question: "Which option from the View Tab allows you to click and drag to move entire sections of a document?", answers: ["Read Mode", "Ruler", "Navigation Pane", "Switch Windows"], correctAnswer: 2, youTubeVideo: "_IecIjxwbvs"},
  {question: "A Table of Contents can be generated from the _____ tab.", answers: ["Insert", "Design", "Layout", "References"], correctAnswer: 3, youTubeVideo: "_IecIjxwbvs"}
];


function renderStartPage() {
  console.log("Rendering start page");
  QUESTION_NUMBER = 0;
  USER_SCORE = 0;  
   $(".container").html('');
   $(".js-question-number").html(0);
   $(".js-current-score").html(0);
   $(".container").append(`
        <h1>${QUIZ_INTRO}</h1>
        <h2>${SCORE_MESSAGE}</h2>
        <form id="start-form">
        <button class="start-button" type="submit">Start!</button>
        </form>
        `);
        $(handleStartClick);
  $(".js-question-total").html(STORE.length);
  
}

function handleStartClick() {
  console.log("Handling start click");
  $("#start-form").submit(event => {
    event.preventDefault();
    return loadQuestion();
  });
}

function loadQuestion() {
  console.log("Loading question");
  $(".container").html(generateItemElement(STORE[QUESTION_NUMBER], QUESTION_NUMBER));
  console.log("html is good");
  $(".js-question-number").html(QUESTION_NUMBER + 1);
  $(handleSubmitClick);
}

function handleSubmitClick() {
  console.log("Handling submit click");
  $("#js-question-form").submit(event => {
    event.preventDefault();
    const answer = $('input[name="answer"]:checked').val();
    checkAnswer(answer);
  });
}

function switchButtons() {
    console.log("switch submit button to continue");
    $(".container").append('<form id="js-continue"><button type="submit">Continue</button></form>');
    $("#js-question-form button").addClass("hidden");
    console.log("increment QUESTION_NUMBER");
    QUESTION_NUMBER++;
    handleContinue();
}

function handleContinue() {
  console.log("Handling continue button");
  $("#js-continue").submit(event => {
    event.preventDefault();
    if ((QUESTION_NUMBER) < STORE.length) {
    loadQuestion();  
    }
    else displayResults();
  });
}

function displayResults() {
  console.log("Displaying results");
  if ((USER_SCORE / STORE.length) >= PASSING_SCORE) {
    $(".container").html(`
      <h1>Congratulations! You passed!</h1>
      <h2>You needed a score of ${(PASSING_SCORE * 100)}% and got ${(USER_SCORE / STORE.length) * 100}%.</h2>
      <img class="feedback-image" src=${PASS_IMAGE}>
      <button class="try-again-button" type="submit">Try Again</button>
      <button class="return-button" type="submit">Back Home</button>
      `);
  }
  else {
    console.log("fail");
      $(".container").html(`
        <h1>You didn't quite make it!</h1>
        <h2>You needed a score of ${(PASSING_SCORE * 100)}% and got ${(USER_SCORE / STORE.length) * 100}%...</h2>
        <img class="feedback-image" src=${FAIL_IMAGE}>
        <h2>Consider reviewing the training  material and then give it another shot!</h2>
        <button class="try-again-button" type="submit">Try Again</button>
        <button class="return-button" type="submit">Back Home</button>
      `);
      }
      handleResultsClick();
}

function handleResultsClick() {
  console.log("Handling results clicks");
  $(".try-again-button").click(event => {
    console.log("Try Again Clicked");
    renderStartPage();
  });
  $(".return-button").click(event => {
    console.log("Return Clicked");
    window.open(HOMEPAGE);
  });
}

function checkAnswer(answer){
  console.log("Checking the answer");
  correctAnswer = STORE[QUESTION_NUMBER].correctAnswer;
  if (answer == correctAnswer) {
    console.log("right answer");
    USER_SCORE++;
    $(".js-current-score").html(USER_SCORE);
    $(".container").append(`<p class="correct">Correct!</p>`);
    $("#js-question-form").find(`.${answer}`).addClass("right-answer");
    switchButtons(); 
  }
    else {
      $(".container").append(`<p class="sorry">Sorry! That's not the right answer. Here's a training video to brush up on the topic.</p>`);
      $("#js-question-form").find(`.${answer}`).addClass("wrong-answer");
      $("#js-question-form").find(`.${correctAnswer}`).addClass("right-answer");
      let youTubeId = STORE[QUESTION_NUMBER].youTubeVideo;
      console.log(youTubeId);
      youTubeFeedback(youTubeId, displayVideo); 
    }
}

function youTubeFeedback(id, callback) {
    
    var request = {
        data: {
          part: 'snippet',
          type: "video"
          },
        url: `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${API_KEY}`,
        dataType: "json",
        success: callback
      };
      console.log("Executing search");
      console.log(id);
      $.ajax(request);
}

function displayVideo(results) {
    console.log("Displaying video");
    results.items.map(item => {
      console.log(item.id);
      console.log(item.snippet.title);
        $(".container").append(`
        <p class="youtube-title">${item.snippet.title}</p><a target="blank" href="https://www.youtube.com/watch?v=${item.id}"><img class="thumbnail" src="${item.snippet.thumbnails.high.url}"</a>
        `);
    });
    switchButtons();
}

//replace with function that loops based on STORE length so HTML can dynamically change (add as many answers as STORE dictates)
function generateItemElement(item, itemIndex) {
  console.log("Generating html element");
  return `
    <form id="js-question-form">
      <h2>${item.question}</h2>
        <ul class="radio-buttons">
        <li><input type="radio" name="answer" id="ans1" value="0" required><label class="0" for="ans1">${item.answers[0]}</label></li>
        <li><input type="radio" name="answer" id="ans2" value="1" required><label class="1" for="ans2">${item.answers[1]}</label></li>
        <li><input type="radio" name="answer" id="ans3" value="2" required><label class="2" for="ans3">${item.answers[2]}</label></li>
        <li><input type="radio" name="answer" id="ans4" value="3" required><label class="3" for="ans4">${item.answers[3]}</label></li>
        </ul>
        <button type="submit">Submit</button>
      </form>`;
}

$(renderStartPage);
