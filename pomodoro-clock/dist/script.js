// Beep sound effect to indicate the timer reaching 0.
const beep = document.getElementById("beep");

// Main component, which handles the user changing session and break lengths, passing them as props to the Timer component.
class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: 25,
      break: 5 };

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
        break: 5 });

    }.bind(this));

  }

  sessionDecrease() {
    if (this.state.session <= 1) {
      this.setState({
        session: 1 });

    } else {
      this.setState(prevState => ({
        session: prevState.session - 1 }));

    }
  }

  sessionIncrease() {
    if (this.state.session >= 60) {
      this.setState({
        session: 60 });

    } else {
      this.setState(prevState => ({
        session: prevState.session + 1 }));

    }
  }

  breakDecrease() {
    if (this.state.break <= 1) {
      this.setState({
        break: 1 });

    } else {
      this.setState(prevState => ({
        break: prevState.break - 1 }));

    }
  }

  breakIncrease() {
    if (this.state.break >= 60) {
      this.setState({
        break: 60 });

    } else {
      this.setState(prevState => ({
        break: prevState.break + 1 }));

    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "pomodoro" }, /*#__PURE__*/
      React.createElement("h1", { id: "name" }, "P O M O D O R O"), /*#__PURE__*/
      React.createElement("div", { id: "top" }, /*#__PURE__*/
      React.createElement("div", { id: "session" }, /*#__PURE__*/
      React.createElement("div", { id: "session-label" }, "Session Length"), /*#__PURE__*/
      React.createElement("div", { className: "control" }, /*#__PURE__*/
      React.createElement("button", {
        id: "session-decrement",
        class: "plus-minus-button",
        onClick: this.sessionDecrease }, "-"), /*#__PURE__*/



      React.createElement("p", { id: "session-length" }, this.state.session), /*#__PURE__*/
      React.createElement("button", {
        id: "session-increment",
        class: "plus-minus-button",
        onClick: this.sessionIncrease }, "+"))), /*#__PURE__*/





      React.createElement("div", { id: "break" }, /*#__PURE__*/
      React.createElement("div", { id: "break-label" }, "Break Length"), /*#__PURE__*/
      React.createElement("div", { className: "control" }, /*#__PURE__*/
      React.createElement("button", {
        id: "break-decrement",
        class: "plus-minus-button",
        onClick: this.breakDecrease }, "-"), /*#__PURE__*/



      React.createElement("p", { id: "break-length" }, this.state.break), /*#__PURE__*/
      React.createElement("button", {
        id: "break-increment",
        class: "plus-minus-button",
        onClick: this.breakIncrease }, "+")))), /*#__PURE__*/






      React.createElement(Timer, { session: this.state.session, break: this.state.break })));


  }}


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
      timeDisplay: "25:00" };

    this.startStop = this.startStop.bind(this);
    this.tick = this.tick.bind(this);
    this.reset = this.reset.bind(this);
    this.convertToMinutesAndSeconds = this.convertToMinutesAndSeconds.bind(
    this);

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
        timeLeft: this.props.session * 60 },

      () => {
        this.convertToMinutesAndSeconds();
      });

    }

    if (prevProps.break !== this.props.break) {
      this.setState(
      {
        break: this.props.break },

      () => {
        this.convertToMinutesAndSeconds();
      });

    }
  }

  convertToMinutesAndSeconds() {
    let time = "";
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = 0 + this.state.timeLeft % 60;

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
      timeDisplay: time });

  }

  startStop() {
    if (this.state.started === false) {
      this.setState({
        started: true });

    } else {
      this.setState({
        started: false });

    }
  }

  reset() {
    beep.pause();
    beep.load();
    this.setState(
    {
      phase: "SESSION",
      started: false,
      timeLeft: this.state.session * 60 },

    () => {
      this.convertToMinutesAndSeconds();
    });

  }

  tick() {
    if (this.state.timeLeft <= 0) {
      if (this.state.phase == "SESSION") {
        this.setState({
          started: true,
          phase: "BREAK",
          timeLeft: this.state.break * 60 + 1 });

      } else if (this.state.phase == "BREAK") {
        this.setState({
          started: true,
          phase: "SESSION",
          timeLeft: this.state.session * 60 + 1 });

      }
      this.convertToMinutesAndSeconds();
    }
    if (this.state.started === true && this.state.timeLeft > 0) {
      this.setState(prevState => ({
        timeLeft: prevState.timeLeft - 1 }));

      if (this.state.timeLeft == 0) {
        beep.play();
      }
    }
    this.convertToMinutesAndSeconds();
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "bottom" }, /*#__PURE__*/
      React.createElement("div", { id: "timer" }, /*#__PURE__*/
      React.createElement("h2", { id: "timer-label" }, this.state.phase), /*#__PURE__*/
      React.createElement("h4", { id: "time-left" }, this.state.timeDisplay)), /*#__PURE__*/

      React.createElement("div", { id: "buttons" }, /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.startStop }, "START / PAUSE"), /*#__PURE__*/


      React.createElement("div", { id: "start-shadow" })), /*#__PURE__*/

      React.createElement("div", null, /*#__PURE__*/
      React.createElement("button", { id: "reset", onClick: this.reset }, "RESET"), /*#__PURE__*/


      React.createElement("div", { id: "reset-shadow" })))));




  }}


// Decided against using Redux
// const store = redux.createStore(timerActions);

ReactDOM.render( /*#__PURE__*/
React.createElement("div", null, /*#__PURE__*/
React.createElement(Pomodoro, null)),

document.getElementById("root"));