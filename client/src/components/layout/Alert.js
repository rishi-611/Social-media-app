import React from "react";
import { connect } from "react-redux";

// checks if alerts is not empty and not null, then for each alert in alerts array, displays it

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.type}`}>
      {alert.message}
    </div>
  ));

const mapStateToProps = (state) => {
  return {
    alerts: state.alerts,
  };
};
export default connect(mapStateToProps)(Alert);
