import React, { Component } from "react";

import { convertHoursToHumanReadableFormatWithoutSeconds } from "./utils";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sleepHours: 6,
      newActivityTime: "",
      newActivityTimeString: "0h 0m",
      newActivityDescription: "Your activity description...",
      happyNotes: localStorage.getItem("happyNotes") || "",
      sadNotes: localStorage.getItem("sadNotes") || "",
      activities: JSON.parse(localStorage.getItem("activities")) || []
    };
  }
  componentDidMount() {
    const that = this;
    setInterval(() => {
      localStorage.setItem("activities", JSON.stringify(that.state.activities));
    }, 1000);
  }
  deleteActivities = () => {
    const confirmed = window.confirm(`Are you sure to delete activity?`);
    if (confirmed) {
      this.setState(prevState => ({
        activities: []
      }));
    }
  };

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
      newActivityTimeString: "0h 0m"
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
          <div className="col-md-12">
            <div className="col-md-8">
              <header>
                <h1>Manage your day</h1>
              </header>
              <label>Your sleep hours</label>
              <input
                placeholder="Sleep hours"
                className="form-control input-sm"
                value={this.state.sleepHours}
                onChange={event => this.setState({ sleepHours: event.target.value })}
              />
              <label>Add new activity</label>
              <div className="flex-container">
                <input
                  placeholder="Time to spent (0h 0m)"
                  type="text"
                  className="form-control input-sm text-right"
                  value={this.state.newActivityTimeString}
                  style={{ marginRight: 5, width: "75px" }}
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
              <div class="col-md-12 col-xs-12 no-pm">
                <h3 class="activities-title">
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
                        style={{ marginRight: 5, width: "75px" }}
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
            <div className="col-md-4">
              <h3 class="notes-title">Update these one at the end of your day to sum up your day</h3>
              <div>
                <label>
                  Happy notes <span class="fa fa-smile-beam" /> (describe here things that happened and made you happy)
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
                  Sadness notes <span class="fa fa-frown" /> (describe here things that happened and made you sad/angry)
                </label>
                <textarea
                  placeholder="Sad notes"
                  className="form-control input-sm"
                  value={this.state.sadNotes}
                  onChange={event => this.changeSadNotes(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
