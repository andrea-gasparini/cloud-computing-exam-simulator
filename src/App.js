import './App.css';
import questions from "./assets/questions";
import React, {Component, Fragment} from "react";
import Alarms from "./assets/images/alarms.png";
import HDFSArchitecture from "./assets/images/hdfs.png"
import BigTableArchitecture from "./assets/images/bigtable.png";
import KubernatesArchitecture from "./assets/images/kubernetes.png";
import MAPEK from "./assets/images/mapek.png";
import GFSArchitecture from "./assets/images/gfs.png";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quiz: null,
      timer_minutes: 30,
      timer_seconds: 0,
      optionAnswersCheck: false,
      score: {},
      evaluated: false,
      answersSelection: {},
      darkMode: true
    };

    this.questions_number = 35;
    this.timer = 0;

    this.mapImages = {
      "alarms": Alarms,
      "bigtable": BigTableArchitecture,
      "kubernetes": KubernatesArchitecture,
      "mapek": MAPEK,
      "hdfs": HDFSArchitecture,
      "gfs": GFSArchitecture
    }

    Object.keys(questions).forEach((key) => {
      questions[key]["answersQuizzed"] = [];
      for(let i = 0; i < questions[key]["options"].length; i++) {
        questions[key]["answersQuizzed"].push(
            [questions[key]["options"][i], i == questions[key]["answer"]]
        );
      }
      this.shuffle(questions[key]["answersQuizzed"])
    });

  }

  componentDidMount() {
    let quiz = this.get_random_questions();
    this.setState({quiz});
    this.timer = setInterval(() => {
      let {timer_minutes, timer_seconds} = this.state;
      if(timer_seconds == 0 && timer_minutes >= 0)
        this.setState({timer_seconds: 59, timer_minutes: --timer_minutes});
      else if(timer_minutes >= 0)
        this.setState({timer_seconds: --timer_seconds});

      if(timer_seconds <= 0 && timer_minutes <= 0) {
        let inputs = document.getElementsByTagName("INPUT");
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i].type === 'radio') {
            inputs[i].disabled = true;
          }
        }
        this.timer = clearInterval(this.timer);
        this.setState({timer_seconds: 0, timer_minutes: 0})
      }
    }, 1000);

    window.onbeforeunload = () => {
      return "Are u sure you want to leave?";
    };

    if(this.state.darkMode) {
      document.body.style.backgroundColor = "#0c0c0c";
    }
  }

  get_random_questions = () => {
    let quiz = this.shuffle(questions);
    quiz = quiz.slice(0, this.questions_number);
    return quiz;
  };

  reset_question_color = (questionKey, n) => {
    for(let i = 0; i < n; i++) {
      let answer_element = document.getElementById(`question_${questionKey}_${i}`);
      answer_element.style.color = this.state.darkMode ? "#e4e4e4" : "black";
      answer_element.style.fontWeight = "normal";
    }
  };

  calculate_correct_idx = (qst) => {
    let jk = -1;
    for(let i = 0; i < qst.length; i++) {
      if(qst[i][1]) {
        jk = i;
        break;
      }
    }
    return jk;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.darkMode != this.state.darkMode && !this.state.darkMode)
    {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    } else if(prevState.darkMode != this.state.darkMode && this.state.darkMode) {
      document.body.style.backgroundColor = "#0c0c0c";
      document.body.style.color = "#e4e4e4";
    }
  }

  evaluate_question = (question, selected, questionKey, answerObj, fromButton=false) => {
    let {optionAnswersCheck, score, answersSelection} = this.state;

    if(optionAnswersCheck && !fromButton) {
      this.reset_question_color(questionKey, question["options"].length);
      let selected_answer_element = document.getElementById(`question_${questionKey}_${selected}`);
      if(typeof(answerObj) !== "undefined") {
        if(answerObj[1]) {
          selected_answer_element.style.color = "green";
          selected_answer_element.style.fontWeight = "bold";
          score[questionKey] = 2;
          answersSelection[questionKey] = selected;
        } else {
          selected_answer_element.style.color = "red";
          selected_answer_element.style.fontWeight = "bold";
          score[questionKey] = -0.5;
          answersSelection[questionKey] = selected;
          let correct_answer_element = document.getElementById(`question_${questionKey}_${this.calculate_correct_idx(question["answersQuizzed"])}`);
          correct_answer_element.style.color = "green";
          correct_answer_element.style.fontWeight = "bold";
        }
      } else {
        score[questionKey] = 0;
        answersSelection[questionKey] = null;
        let correct_answer_element = document.getElementById(`question_${questionKey}_${this.calculate_correct_idx(question["answersQuizzed"])}`);
        correct_answer_element.style.color = "green";
        correct_answer_element.style.fontWeight = "bold";
      }
    } else {
      if(!fromButton) {
        if (answerObj[1]) {
          score[questionKey] = 2;
          answersSelection[questionKey] = selected;
        } else if (answerObj != null && !answerObj[1]) {
          score[questionKey] = -1;
          answersSelection[questionKey] = selected;
        } else {
          score[questionKey] = 0;
          answersSelection[questionKey] = selected;
        }
        this.setState({score, answersSelection});
      } else {
        this.timer = clearInterval(this.timer);
        this.setState({timer_minutes: 30, timer_seconds: 0, evaluated: true});
        let {quiz} = this.state;
        Object.keys(this.state.score).map((key) => {
          if(score[key] == 2) {
            // corretta
            let selected_answer_element = document.getElementById(`question_${key}_${this.calculate_correct_idx(quiz[key]["answersQuizzed"])}`);
            if(selected_answer_element !== null) {
              selected_answer_element.style.color = "green";
              selected_answer_element.style.fontWeight = "bold";
            }
          } else if(score[key] == -1) {
            let selected_answer_element = document.getElementById(`question_${key}_${answersSelection[key]}`);
            let correct_answer_element = document.getElementById(`question_${key}_${this.calculate_correct_idx(quiz[key]["answersQuizzed"])}`);
            if(correct_answer_element != null) {
              correct_answer_element.style.color = "green";
              correct_answer_element.style.fontWeight = "bold";
            }

            if(selected_answer_element != null) {
              selected_answer_element.style.color = "red";
              selected_answer_element.style.fontWeight = "bold";
            }
          } else {
            let correct_answer_element = document.getElementById(`question_${key}_${this.calculate_correct_idx(quiz[key]["answersQuizzed"])}`);
            if(correct_answer_element != null) {
              correct_answer_element.style.color = "green";
              correct_answer_element.style.fontWeight = "bold";
            }
          }
        })
      }
    }

    /*if(optionAnswersCheck) {
      this.reset_question_color(questionKey, question["options"].length);
      let selected_answer_element = document.getElementById(`question_${questionKey}_${selected}`);
      if(answerObj[1]) {
        selected_answer_element.style.color = "green";
        selected_answer_element.style.fontWeight = "bold";
        score[questionKey] = 2;
        answersSelection[questionKey] = selected;
      } else if(selected !== null) {
        let correct_answer_element = document.getElementById(`question_${questionKey}_${question["answer"]}`);
        correct_answer_element.style.color = "green";
        correct_answer_element.style.fontWeight = "bold";
        selected_answer_element.style.color = "red";
        selected_answer_element.style.fontWeight = "bold";
        score[questionKey] = -1;
        answersSelection[questionKey] = selected;
      } else {
        let correct_answer_element = document.getElementById(`question_${questionKey}_${question["answer"]}`);
        correct_answer_element.style.color = "green";
        correct_answer_element.style.fontWeight = "bold";
        score[questionKey] = 0;
        answersSelection[questionKey] = selected;
      }
      this.setState({score, answersSelection});
    } else {
      if(!fromButton) {
        if (selected == question["answer"]) {
          score[questionKey] = 2;
          answersSelection[questionKey] = selected;
        } else if (selected != null) {
          score[questionKey] = -1;
          answersSelection[questionKey] = selected;
        } else {
          score[questionKey] = 0;
          answersSelection[questionKey] = selected;
        }
        this.setState({score, answersSelection});
      } else {
        this.timer = clearInterval(this.timer);
        this.setState({timer_minutes: 30, timer_seconds: 0, evaluated: true});
        let {quiz} = this.state;
        Object.keys(this.state.score).map((key) => {
          if(score[key] == 2) {
            // corretta
            let selected_answer_element = document.getElementById(`question_${key}_${[quiz[key]["answer"]]}`);
            if(selected_answer_element !== null) {
              selected_answer_element.style.color = "green";
              selected_answer_element.style.fontWeight = "bold";
            }
          } else if(score[key] == -1) {
            let selected_answer_element = document.getElementById(`question_${key}_${answersSelection[key]}`);
            let correct_answer_element = document.getElementById(`question_${key}_${quiz[key]["answer"]}`);
            correct_answer_element.style.color = "green";
            correct_answer_element.style.fontWeight = "bold";
            selected_answer_element.style.color = "red";
            selected_answer_element.style.fontWeight = "bold";
            score[questionKey] = -1;
          }
        })
      }
    } */
  };

  shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  render() {
    let {quiz, timer_minutes, timer_seconds, optionAnswersCheck, score, evaluated, darkMode} = this.state;
    let score_point = 0;
    if(Object.keys(score).length > 0) {
      score_point = Object.values(score).reduce((a, b) => a + b);
    }
    if(quiz != null) {
      return (
          <div className={["fullwidth quiz contentcentered", darkMode ? "darkTheme" : ""].join(" ")} >
            <div className={"checksolutionoption"}>
              <input onChange={() => this.setState({optionAnswersCheck: !optionAnswersCheck})} type={"checkbox"} name={"itsfridaythen"} checked={optionAnswersCheck} />
              <label>
                Check if you want to see the correct answer every time you select an option.
              </label>
            </div>
            <div className={"questions"}>
              {quiz.map((questionObject, key) => {
                return (
                    <div key={key} className={"question"}>
                      <div className={"questiontext"}>{questionObject["question"]}</div>
                      {"figure" in questionObject &&
                          <div style={{maxWidth: "600px", maxHeight: "500px", margin: "5px"}}>
                            <img src={this.mapImages[questionObject["figure"]]} />
                          </div>
                      }
                      <div className={"answers"}>
                        {questionObject["answersQuizzed"].map((answer, keyAnswer) => {
                          return (
                            <div key={keyAnswer}>
                              <input onChange={() => this.evaluate_question(questionObject, keyAnswer, key, questionObject["answersQuizzed"][keyAnswer])} value={keyAnswer} type={"radio"} name={`question_${key}`} />
                              <label id={`question_${key}_${keyAnswer}`}>{answer[0]}</label>
                            </div>
                          )
                        })}
                        <div>
                          <input onChange={() => this.evaluate_question(questionObject, null, key)} type={"radio"} name={`question_${key}`} />
                          <label id={`question_${key}_null`}>No answer</label>
                        </div>
                      </div>
                    </div>
                )
              })}
            </div>
            <div className={"score"}>
              Score: {optionAnswersCheck ? score_point : evaluated ? score_point : 0}/70
            </div>
            <div className={"nightMode"}>
              <label>Night mode</label>
              <input type={"checkbox"} checked={darkMode} onChange={() => this.setState({darkMode: !darkMode})}  />
            </div>
            <div className={["timer", darkMode ? "black" : ""].join(" ")}>
              {timer_minutes}:{timer_seconds < 10 ? `0${timer_seconds}` : timer_seconds}
            </div>
            <div style={{marginBottom: 30}}>
              <button onClick={() => this.evaluate_question(null, null, null, null, true)} className={"sendQuiz"}>Evaluate quiz</button>
            </div>
          </div>
      );
    } else {
      return (
          <div className={"centered loading fullwidth"}>
            Loading quiz..
          </div>
      )
    }
  }
}

export default App;
