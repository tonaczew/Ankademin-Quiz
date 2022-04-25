//Philip Tonaczew

const questionDiv = $(".question-div");
const finalScoreParagraph = $("#final-score");
const resultFieldset = $("#result-fieldset");
const questionContainer = $("#question-container");
const resultContainer = $("#result-container");
const resultButton = $("#result-btn");
let currentScore, questionAnswered, numberOfQuestions, answers;

const initial = () => {
  questionContainer.hide();
  resultContainer.hide();
};

const newGame = () => {
  score = 0;
  currentScore = 0;
  questionAnswered = 0;
  answers = [];
  questionDiv.empty();
  finalScoreParagraph.empty();
  questionContainer.show();
  resultContainer.show();
  resultButton.hide();
};

// get data from api
const getQuestionData = async (url) => {
  const parameterNrQuestions = $("#nr-of-questions").val();
  const parameterDifficulty = $("#select-difficulty").val();
  const parameterType = $("#select-type").val();
  const parameterCategory = $("#select-category").val();

  const respons = await axios.get(url, {
    params: {
      amount: parameterNrQuestions,
      difficulty: parameterDifficulty,
      type: parameterType,
      category: parameterCategory,
    },
  });
  return respons.data;
};

// Generate question button

$("#generate-btn").click(async () => {
  newGame();
  const data = await getQuestionData("https://opentdb.com/api.php");
  numberOfQuestions = data.results.length;

  data.results.forEach((e, index) => {
    const answerButtons = [];
    const question = e.question;
    const incorrectAnswers = e.incorrect_answers;
    const correctAnswer = e.correct_answer;
    console.log(correctAnswer);

    const checkAnswer = $(
      `<p class="check-user-answer">Your Answer: </p>`
    ).hide();

    const questionContent = $(
      `<div id="question-content-${index}" class="question-content"></div>`
    );
    const fieldSet = $(
      `<fieldset class="question-fieldset"><legend>Question #${
        index + 1
      }</legend> </fieldset>`
    );
    answers.push(questionContent);

    const questionHead = $(`<h5>${question}</h5>`);
    const corAns = $(
      `<button class="answer-btns btn correct-btn">${correctAnswer}</button>`
    ).click(() => {
      checkAnswer.append("Correct");
      currentScore++;
      checkResutBtnRelease();
      disableButtonsInCurrentDiv(index);
    });
    fieldSet.append(questionHead);
    answerButtons.push(corAns);

    incorrectAnswers.forEach((e) => {
      const button = $(`<button class="answer-btns btn">${e}</button>`).click(
        () => {
          disableButtonsInCurrentDiv(index);
          checkAnswer.append("Wrong");
          checkResutBtnRelease();
        }
      );
      answerButtons.push(button);
    });
    questionContent.append(fieldSet);
    questionDiv.append(questionContent);

    answerButtons.sort(compareBtn).forEach((b) => {
      fieldSet.append(b);
    });
    fieldSet.append(checkAnswer);
  });
});

function disableButtonsInCurrentDiv(index) {
  $(`#question-content-${index} .answer-btns`).addClass("disabled-btn");
}

function checkResutBtnRelease() {
  questionAnswered++;
  if (questionAnswered === numberOfQuestions) {
    resultButton.show();
  }
}

// Result button

resultButton.click(() => {
  $(".check-user-answer").show();
  finalScoreParagraph.append(finalScore());
  resultButton.hide();
  colorAnswers();
});

// Final score

const finalScore = () => {
  let score = Math.trunc((currentScore / numberOfQuestions) * 100);
  if (score < 50) {
    score += presentFinalScore(" % Correct! Not a great performance", "red");
  } else if (score >= 50 && score < 75) {
    score += presentFinalScore(" % Correct! Good performance", "yellow");
  } else {
    score += presentFinalScore(" % Correct! Very good perforamnce", "green");
  }
  return score;
};

function presentFinalScore(text, color) {
  finalScoreParagraph.css("background-color", `${color}`);
  return text;
}

const colorAnswers = () => {
  for (let i = 0; i < answers.length; i++) {
    const box = document.querySelector(`#question-content-${i}`);
    box.textContent.includes("Wrong")
      ? colorQuestionContentResult(i, "red")
      : colorQuestionContentResult(i, "green");
  }
};

function colorQuestionContentResult(index, color) {
  $(`#question-content-${index} fieldset`).css("background-color", `${color}`);
}

// Theme button

$("#change-theme").click(() => {
  $("body").toggleClass("dark-theme");
});

// Compare function

function compareBtn(a, b) {
  if (a[0].innerText < b[0].innerText) {
    return -1;
  }
  if (a[0].innerText > b[0].innerText) {
    return 1;
  }
  return 0;
}

initial();
