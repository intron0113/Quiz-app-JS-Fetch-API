{
  const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

  class Quiz {
    constructor(quizData) {
      this._quizzes = quizData.results;
      this._correctAnswersNum = 0;
    }

    getQuizCategory(index) {
      return this._quizzes[index - 1].category;
    }

    getQuizDifficulty(index) {
      return this._quizzes[index - 1].difficulty;
    }

    getNumOfQuiz() {
      return this._quizzes.length;
    }

    getQuizQuestion(index) {
      return this._quizzes[index - 1].question;
    }

    getCorrectAnswer(index) {
      return this._quizzes[index - 1].correct_answer;
    }

    getIncorrectAnswers(index) {
      return this._quizzes[index - 1].incorrect_answers;
    }

    countCorrectAnswersNum(index, answer) {
      const correctAnswer = this._quizzes[index - 1].correct_answer;
      if (answer === correctAnswer) {
        return this._correctAnswersNum++;
      }
    }

    getCorrectAnswersNum() {
      return this._correctAnswersNum;
    }
  }

  const titleElement = document.getElementById('title');
  const categoryElement = document.getElementById('category');
  const quizElement = document.getElementById('quiz');
  const startButton = document.getElementById('btn');
  const ansContainer = document.getElementById('ans');
  const difficultyElement = document.getElementById('difficulty');

  startButton.addEventListener('click', () => {
    startButton.hidden = true;
    fetchQuizData(1);
  });

  const fetchQuizData = async (index) => {
    titleElement.textContent = '取得中';
    quizElement.textContent = '少々お待ち下さい';

    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);

    setNextQuiz(quizInstance, index);
  };

  const setNextQuiz = (quizInstance, index) => {
    while (ansContainer.firstChild) {
      ansContainer.removeChild(ansContainer.firstChild);
    }

    if (index <= quizInstance.getNumOfQuiz()) {
      makeQuiz(quizInstance, index);
    } else {
      finishQuiz(quizInstance);
    }
  };

  const makeQuiz = (quizInstance, index) => {
    titleElement.innerHTML = `問題 ${index}`;
    categoryElement.innerHTML = `【ジャンル】 ${quizInstance.getQuizCategory(
      index
    )}`;
    difficultyElement.innerHTML = `【難易度】 ${quizInstance.getQuizDifficulty(
      index
    )}`;
    quizElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(index)}`;

    const answers = buildAnswers(quizInstance, index);

    answers.forEach((answer) => {
      const answerElement = document.createElement('li');
      ansContainer.appendChild(answerElement);

      const buttonElement = document.createElement('button');
      buttonElement.innerHTML = answer;
      answerElement.appendChild(buttonElement);

      buttonElement.addEventListener('click', () => {
        quizInstance.countCorrectAnswersNum(index, answer);
        index++;
        setNextQuiz(quizInstance, index);
      });
    });
  };

  const finishQuiz = (quizInstance) => {
    titleElement.textContent = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}です`;
    categoryElement.textContent = '';
    difficultyElement.textContent = '';
    quizElement.textContent = '再チャレンジしたい場合は下をクリック';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'ホームに戻る';
    ansContainer.appendChild(restartButton);
    restartButton.addEventListener('click', () => {
      location.reload();
    });
  };

  const buildAnswers = (quizInstance, index) => {
    const answers = [
      quizInstance.getCorrectAnswer(index),
      ...quizInstance.getIncorrectAnswers(index),
    ];
    return shuffleArray(answers);
  };

  const shuffleArray = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
}
