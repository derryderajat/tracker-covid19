import React from "react";
import "./infoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
function InfoBox({ title, cases, casesType, active, total, ...props }) {
  const isRecovered = casesType === "recovered" ? true : false;
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"}`}
    >
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* Number of Cases */}
        <h2 className={`infoBox--cases ${isRecovered && "infoBox--recovered"}`}>
          {cases}
        </h2>
        {/* Total */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
