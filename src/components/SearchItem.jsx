import React from "react";

export const SearchItem = ({ data, history }) => {
  function calcElapsedTime(time) {
    const currTime = Date.now();
    const updatedTime = new Date(time).getTime();
    const inMil = currTime - updatedTime;
    const inSec = inMil / 1000;
    const inMin = inSec / 60;
    const inHour = inMin / 60;
    if (inHour >= 24) {
      let days = inHour / 24;
      return Math.round(days) + " days ago";
    } else if (inHour >= 0.5) return Math.round(inHour) + " hours ago";
    else return Math.round(inMin) + " minutes ago";
  }

  console.log(data, history);
  return (
    <div className="search-item-container">
      <p
        className="pointer-link"
        onClick={() => history.push(`/rep/${data.id}`)}
      >
        {data.name}
      </p>
      <a className="text-center pointer-link" href={data.html_url}>
        Source code
      </a>
      <p className="date">{calcElapsedTime(data.updated_at)}</p>
      <p className="stars">{data.stargazers_count}</p>
    </div>
  );
};
