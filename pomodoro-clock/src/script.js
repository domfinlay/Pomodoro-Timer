// Beep sound effect to indicate the timer reaching 0.
const beep = document.getElementById("beep");

// Main component, which handles the user changing session and break lengths, passing them as props to the Timer component.
class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: 25,
      break: 5
    };
    this.sessionDecrease = this.sessionDecrease.bind(this);
    this.sessionIncrease = this.sessionIncrease.bind(this);
    this.breakDecrease = this.breakDecrease.bind(this);
    this.breakIncrease = this.breakIncrease.bind(this);
  }

  componentDidMount() {
    document.getElementById("reset").addEventListener(
      "click",
      function () {
        this.setState({
          session: 25,
          break: 5
        });
      }.bind(this)
    );
  }

  sessionDecrease() {
    if (this.state.session <= 1) {
      this.setState({
        session: 1
      });
    } else {
      this.setState((prevState) => ({
        session: prevState.session - 1
      }));
    }
  }

  sessionIncrease() {
    if (this.state.session >= 60) {
      this.setState({
        session: 60
      });
    } else {
      this.setState((prevState) => ({
        session: prevState.session + 1
      }));
    }
  }

  breakDecrease() {
    if (this.state.break <= 1) {
      this.setState({
        break: 1
      });
    } else {
      this.setState((prevState) => ({
        break: prevState.break - 1
      }));
    }
  }

  breakIncrease() {
    if (this.state.break >= 60) {
      this.setState({
        break: 60
      });
    } else {
      this.setState((prevState) => ({
        break: prevState.break + 1
      }));
    }
  }

  render() {
    return (
      <div id="pomodoro">
        <h1 id="name">P O M O D O R O</h1>
        <div id="top">
          <div id="session">
            <div id="session-label">Session Length</div>
            <div className="control">
              <button
                id="session-decrement"
                class="plus-minus-button"
                onClick={this.sessionDecrease}
              >
                -
              </button>
              <p id="session-length">{this.state.session}</p>
              <button
                id="session-increment"
                class="plus-minus-button"
                onClick={this.sessionIncrease}
              >
                +
              </button>
            </div>
          </div>
          <div id="break">
            <div id="break-label">Break Length</div>
            <div className="control">
              <button
                id="break-decrement"
                class="plus-minus-button"
                onClick={this.breakDecrease}
              >
                -
              </button>
              <p id="break-length">{this.state.break}</p>
              <button
                id="break-increment"
                class="plus-minus-button"
                onClick={this.breakIncrease}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <Timer session={this.state.session} break={this.state.break} />
      </div>
    );
  }
}

// Timer component handles starting, pausing, resetting and displaying time.
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: "SESSION",
      started: false,
      session: this.props.session,
      break: this.props.break,
      timeLeft: this.props.session * 60,
      timeDisplay: "25:00"
    };
    this.startStop = this.startStop.bind(this);
    this.tick = this.tick.bind(this);
    this.reset = this.reset.bind(this);
    this.convertToMinutesAndSeconds = this.convertToMinutesAndSeconds.bind(
      this
    );
  }

  componentDidMount() {
    setInterval(this.tick, 1000);
    this.convertToMinutesAndSeconds();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.session !== this.props.session) {
      this.setState(
        {
          session: this.props.session,
          timeLeft: this.props.session * 60
        },
        () => {
          this.convertToMinutesAndSeconds();
        }
      );
    }

    if (prevProps.break !== this.props.break) {
      this.setState(
        {
          break: this.props.break
        },
        () => {
          this.convertToMinutesAndSeconds();
        }
      );
    }
  }

  convertToMinutesAndSeconds() {
    let time = "";
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = 0 + (this.state.timeLeft % 60);

    if (minutes < 10) {
      time += "0";
    }

    if (seconds == 0) {
      time += minutes.toString() + ":00";
    } else {
      if (seconds < 10) {
        time += minutes.toString() + ":0" + seconds.toString();
      } else {
        time += minutes.toString() + ":" + seconds.toString();
      }
    }

    this.setState({
      timeDisplay: time
    });
  }

  startStop() {
    if (this.state.started === false) {
      this.setState({
        started: true
      });
    } else {
      this.setState({
        started: false
      });
    }
  }

  reset() {
    beep.pause();
    beep.load();
    this.setState(
      {
        phase: "SESSION",
        started: false,
        timeLeft: this.state.session * 60
      },
      () => {
        this.convertToMinutesAndSeconds();
      }
    );
  }

  tick() {
    if (this.state.timeLeft <= 0) {
      if (this.state.phase == "SESSION") {
        this.setState({
          started: true,
          phase: "BREAK",
          timeLeft: this.state.break * 60 + 1
        });
      } else if (this.state.phase == "BREAK") {
        this.setState({
          started: true,
          phase: "SESSION",
          timeLeft: this.state.session * 60 + 1
        });
      }
      this.convertToMinutesAndSeconds();
    }
    if (this.state.started === true && this.state.timeLeft > 0) {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft - 1
      }));
      if (this.state.timeLeft == 0) {
        beep.play();
      }
    }
    this.convertToMinutesAndSeconds();
  }

  render() {
    return (
      <div id="bottom">
        <div id="timer">
          <h2 id="timer-label">{this.state.phase}</h2>
          <h4 id="time-left">{this.state.timeDisplay}</h4>
        </div>
        <div id="buttons">
          <div>
            <button id="start_stop" onClick={this.startStop}>
              START / PAUSE
            </button>
            <div id="start-shadow"></div>
          </div>
          <div>
            <button id="reset" onClick={this.reset}>
              RESET
            </button>
            <div id="reset-shadow"></div>
          </div>
        </div>
      </div>
    );
  }
}

// Decided against using Redux
// const store = redux.createStore(timerActions);

ReactDOM.render(
  <div>
    <Pomodoro />
  </div>,
  document.getElementById("root")
);
