import React, { Component } from "react";

import { convertHoursToHumanReadableFormatWithoutSeconds } from "./utils";

const MILISECONDS_IN_HOUR = 360000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sleepHours: Number(localStorage.getItem("sleepHours")) || 6,
      isHappyWithDay: JSON.parse(localStorage.getItem("isHappyWithDay")) || false,
      happyDaysDates: JSON.parse(localStorage.getItem("happyDaysDates")) || {},
      resetOnNewDay: JSON.parse(localStorage.getItem("resetOnNewDay")) || false,
      newActivityTime: "",
      newActivityTimeString: "0h 0m",
      newActivityDescription: "",
      happyNotes: localStorage.getItem("happyNotes") || "",
      sadNotes: localStorage.getItem("sadNotes") || "",
      activities: JSON.parse(localStorage.getItem("activities")) || [
        {
          id: 1,
          description: "Be happy",
          isDone: false,
          time: 1.0,
          timeString: convertHoursToHumanReadableFormatWithoutSeconds(1.0)
        }
      ]
    };
  }
  componentDidMount() {
    const today = new Date().toISOString().substring(0, 10);
    if (
      this.state.resetOnNewDay &&
      (!JSON.parse(localStorage.getItem("happyDaysDates")) ||
        (JSON.parse(localStorage.getItem("happyDaysDates")) &&
          !JSON.parse(localStorage.getItem("happyDaysDates"))[today]))
    ) {
      this.setState({
        isHappyWithDay: false,
        happyNotes: "",
        sadNotes: "",
        activities: []
      });
      localStorage.setItem("activities", []);
      localStorage.setItem("happyNotes", "");
      localStorage.setItem("sadNotes", "");
      localStorage.setItem("isHappyWithDay", false);
    }
    if (
      !JSON.parse(localStorage.getItem("happyDaysDates")) ||
      (JSON.parse(localStorage.getItem("happyDaysDates")) && !JSON.parse(localStorage.getItem("happyDaysDates"))[today])
    ) {
      this.setState({
        isHappyWithDay: false
      });
      localStorage.setItem("isHappyWithDay", false);
    }
    const that = this;
    setInterval(() => {
      localStorage.setItem("activities", JSON.stringify(that.state.activities));
      const currentState = JSON.parse(JSON.stringify(that.state));
      delete currentState.happyDaysDates;
      if (this.state.happyDaysDates) {
        this.state.happyDaysDates[today] = currentState;
      }
      localStorage.setItem("happyDaysDates", JSON.stringify(this.state.happyDaysDates));
      this.setState({ happyDaysDates: this.state.happyDaysDates });
    }, 1000);
    this.handleNotifications();
  }

  deleteActivities = () => {
    const confirmed = window.confirm(`Are you sure to delete activity?`);
    if (confirmed) {
      this.setState(prevState => ({
        activities: []
      }));
    }
  };

  handleNotifications = () => {
    if (!("Notification" in window)) {
      console.log("Notification API not supported!");
      return;
    }

    const that = this;

    Notification.requestPermission(result => {
      let displayMorningNotification = true;
      let displayEveningNotification = true;
      if (result === "granted") {
        setInterval(() => {
          const date = new Date();
          if (date.getHours() === 0) {
            displayMorningNotification = true;
            displayEveningNotification = true;
          }
          if (date.getHours() === 8 && displayMorningNotification) {
            that.nonPersistentNotification("Let's plan your day!");
            displayMorningNotification = false;
          }
          if (date.getHours() === 22 && displayEveningNotification) {
            that.nonPersistentNotification("Let's sum up your day");
            displayEveningNotification = false;
          }
        }, MILISECONDS_IN_HOUR);
      }
      if (result === "default") {
        return alert("If you want to get reminder notifications please enable notifications");
      }
    });
  };

  nonPersistentNotification(message) {
    if (!("Notification" in window)) {
      console.log("Notification API not supported!");
      return;
    }

    try {
      const notification = new Notification(message);
      setTimeout(notification.close.bind(notification), 5000);
    } catch (err) {
      console.log("Notification API error: " + err);
    }
  }

  addActivity = () => {
    if (this.state.newActivityDescription.length === 0) {
      return alert("Insert description first.");
    }
    if (this.state.newActivityTime === 0) {
      return alert("Insert time first in proper format.");
    }
    if (this.getTimeAvailable() - this.state.newActivityTime < 0) {
      return alert("You went over 24h time!");
    }
    this.setState(prevState => ({
      activities: [
        ...prevState.activities,
        {
          id: prevState.activities.length,
          description: prevState.newActivityDescription,
          isDone: false,
          time: this.state.newActivityTime,
          timeString: convertHoursToHumanReadableFormatWithoutSeconds(this.state.newActivityTime)
        }
      ],
      newActivityTimeString: "0h 0m",
      newActivityDescription: ""
    }));
  };
  deleteActivity = activity => {
    const confirmed = window.confirm(`Are you sure to delete activity?`);
    if (confirmed) {
      this.setState(prevState => ({
        activities: prevState.activities.filter(item => item.id !== activity.id)
      }));
    }
  };

  getActivitesTimeSum = () => {
    if (this.state.activities.length === 0) {
      return 0;
    }
    let hoursSum = 0;
    this.state.activities.forEach(item => {
      hoursSum += item.time;
    });
    return hoursSum;
  };

  getTimeAvailable = () => {
    return 24 - this.state.sleepHours - this.getActivitesTimeSum();
  };

  getTimeUsed = () => {
    return this.state.sleepHours + this.getActivitesTimeSum();
  };

  getProgressBarStatus = () => {
    return ~~((this.getTimeUsed() / 24) * 100);
  };

  getTimeFromStrings(string, hours, minutes) {
    if (string) {
      string = string.toLowerCase();
      if (string.includes("h")) {
        hours = Number(string.split("h")[0]);
      }
      if (string.includes("m")) {
        minutes = Number(string.split("m")[0]);
      }
    }
    return { hours, minutes };
  }

  parseTimeStringToHourFloat(value) {
    let [firstString, secondString] = value.split(" ");
    let hours = 0;
    let minutes = 0;
    let formattedTime = { hours: 0, minutes: 0 };
    formattedTime = this.getTimeFromStrings(firstString, hours, minutes);
    hours = formattedTime.hours;
    minutes = formattedTime.minutes;
    formattedTime = this.getTimeFromStrings(secondString, hours, minutes);
    hours = formattedTime.hours;
    minutes = formattedTime.minutes;
    return hours + minutes / 60;
  }

  handleNewActivityTime = value => {
    this.setState({ newActivityTimeString: value });
    this.setState({ newActivityTime: this.parseTimeStringToHourFloat(value) });
  };

  changeHappyNotes(value) {
    this.setState({ happyNotes: value });
    localStorage.setItem("happyNotes", value);
  }

  changeSadNotes(value) {
    this.setState({ sadNotes: value });
    localStorage.setItem("sadNotes", value);
  }

  render() {
    const progressBarValue = this.getProgressBarStatus();
    const progressBarClassName =
      progressBarValue < 80 ? "light-blue" : progressBarValue < 95 ? "progress-bar-warning" : "progress-bar-danger";
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="col-md-8 col-sm-12">
              <header>
                <h1>Manage your day</h1>
                <div className="flex-container mg-bottom-5">
                  Clean activites and notes on start of new day?
                  <input
                    className="happy-day-checkbox"
                    type="checkbox"
                    checked={this.state.resetOnNewDay}
                    style={{ marginLeft: 5 }}
                    onChange={e => {
                      if (this.state.resetOnNewDay) {
                        this.setState({ resetOnNewDay: false });
                        localStorage.setItem("resetOnNewDay", false);
                      } else {
                        this.setState({ resetOnNewDay: true });
                        localStorage.setItem("resetOnNewDay", true);
                      }
                    }}
                  />
                </div>
              </header>
              <label>Your sleep hours</label>
              <input
                placeholder="Sleep hours"
                type="number"
                step={0.1}
                max={24}
                min={0}
                className="form-control input-sm"
                value={this.state.sleepHours}
                onChange={event => {
                  this.setState({ sleepHours: Number(event.target.value) });
                  localStorage.setItem("sleepHours", Number(event.target.value));
                }}
              />
              <label>Add new activity</label>
              <div className="flex-container">
                <input
                  placeholder="Time to spent (0h 0m)"
                  type="text"
                  className="form-control input-sm text-right"
                  value={this.state.newActivityTimeString}
                  style={{ marginRight: 5, width: "70px" }}
                  onChange={event => this.handleNewActivityTime(event.target.value)}
                />

                <input
                  placeholder="Your activity description..."
                  className="form-control input-sm"
                  style={{ marginRight: 5 }}
                  value={this.state.newActivityDescription}
                  onChange={event => this.setState({ newActivityDescription: event.target.value })}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      this.addActivity();
                    }
                  }}
                />
                <button
                  className="btn btn-sm dark-blue pull-right"
                  onClick={this.addActivity}
                  style={{ marginLeft: 5, marginBottom: 10 }}
                >
                  Add activity
                </button>
              </div>
              <p>Available hours to use: {convertHoursToHumanReadableFormatWithoutSeconds(this.getTimeAvailable())}</p>
              <div
                style={{
                  width: "100%",
                  marginTop: 10
                }}
                className="progress"
              >
                <div
                  className={`progress-bar ${progressBarClassName}`}
                  aria-valuenow={progressBarValue}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: `${progressBarValue}%`
                  }}
                >
                  <span>{progressBarValue}% elapsed</span>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 no-pm">
                <h3 className="activities-title">
                  Activities ({this.state.activities.filter(item => item.isDone).length}/{this.state.activities.length})
                </h3>
                <button
                  className="btn btn-sm btn-danger pull-right"
                  onClick={this.deleteActivities}
                  style={{ marginLeft: 5, marginBottom: 10 }}
                >
                  Clear all activites
                </button>
              </div>
              <ul className="list-group">
                {this.state.activities.map((item, index) => {
                  return (
                    <li key={index} className="list-group-item flex-container dark-bg">
                      <input
                        className="activity-checkbox"
                        type="checkbox"
                        checked={item.isDone}
                        style={{ marginRight: 5 }}
                        onChange={e => {
                          item.isDone = !item.isDone;
                          this.setState({});
                        }}
                      />
                      <input
                        placeholder="Time"
                        className="form-control input-sm text-right"
                        value={item.timeString}
                        style={{ marginRight: 5, width: "70px" }}
                        onChange={e => {
                          item.timeString = e.target.value;
                          item.time = this.parseTimeStringToHourFloat(e.target.value);
                          this.setState({});
                        }}
                      />
                      <input
                        placeholder="Description"
                        className="form-control input-sm"
                        defaultValue={item.description}
                        style={{ marginRight: 5, width: "100%" }}
                        onChange={e => {
                          item.description = e.target.value;
                          this.setState({});
                        }}
                      />
                      <button className="btn btn-sm btn-danger pull-right" onClick={() => this.deleteActivity(item)}>
                        <i className="fa fa-trash" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-md-4 col-sm-12">
              <h3 className="notes-title">Update these one at the end of your day to sum up your day</h3>
              <div className="flex-container mg-bottom-5">
                Are you happy with your day?
                <input
                  className="happy-day-checkbox"
                  type="checkbox"
                  checked={this.state.isHappyWithDay}
                  style={{ marginLeft: 5 }}
                  onChange={e => {
                    if (this.state.isHappyWithDay) {
                      this.setState({ isHappyWithDay: false });
                      localStorage.setItem("isHappyWithDay", false);
                    } else {
                      this.setState({ isHappyWithDay: true });
                      localStorage.setItem("isHappyWithDay", true);
                    }
                  }}
                />
              </div>
              <div>
                <label>
                  Happy notes <span className="fa fa-smile-beam" /> (describe here things that happened and made you
                  happy)
                </label>
                <textarea
                  placeholder="Happy notes"
                  className="form-control input-sm"
                  value={this.state.happyNotes}
                  onChange={event => this.changeHappyNotes(event.target.value)}
                />
              </div>
              <div>
                <label>
                  Sadness notes <span className="fa fa-frown" /> (describe here things that happened and made you
                  sad/angry)
                </label>
                <textarea
                  placeholder="Sad notes"
                  className="form-control input-sm"
                  value={this.state.sadNotes}
                  onChange={event => this.changeSadNotes(event.target.value)}
                />
              </div>
              <div className="col-md-12 col-sm-12">
                <h4>
                  List of days you were happy - (if there are not too many - hey don't worry may you have just forgot to
                  set a 'happy' checkbox <span className="fa fa-smile-beam" /> )
                </h4>
                <div className="happy-days-container">
                  {Object.keys(this.state.happyDaysDates).map((key, index) => {
                    if (this.state.happyDaysDates[key].isHappyWithDay) {
                      return (
                        <span key={index}>
                          {index > 0 && ", "}
                          {key}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
