import React, { useState, useEffect } from "react";
import avatar from "../img/avatar.png";
import * as axios from "axios";
import Loading from "../assets/Loading";

export const SecondPage = ({ match, history }) => {
  // console.log(match, history);

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

  const { params } = match;
  const { id } = params;

  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [owner, setOwner] = useState({});
  const [contributers, setContributers] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://api.github.com/repositories/${id}`).then((res) => {
      const { data } = res;
      setData(data);
      setOwner(data.owner);
      axios.get(data.contributors_url).then((res) => {
        setLoading(false);
        const { data } = res;
        setContributers(data);
      });
    });
  }, [id]);

  const goBack = () => {
    history.go(-1);
  };

  return (
    <>
      <div className="secondPage-back">
        <a className="pointer-link" onClick={goBack}>
          Go Back
        </a>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="secondPage-box">
            <div className="repository-title">
              <p>{data.name}</p>
              <span>{data.stargazers_count}</span>
              <span>{calcElapsedTime(data.updated_at)}</span>
            </div>
            <div className="repository-user">
              <img
                className="repository-user__img"
                src={owner.avatar_url ? owner.avatar_url : { avatar }}
                alt="#"
              />
              <a
                href={owner.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repository-user__name"
              >
                {owner.login}
              </a>
            </div>
            <div className="repository-body">
              <p className="repository-body__lang">
                <span className="contrib-name">
                  Language used:
                  <br />
                </span>
                {data.language}
              </p>
              <p className="repository-body__desc">
                <span className="contrib-name">Description</span>: <br />
                {data.description}
              </p>
              <div className="repository-body__contrib">
                <h3>Top 10 contributers:</h3>
                <ol className="contrib-list">
                  {contributers.slice(0, 10).map((item, index) => {
                    return (
                      <li className="contrib-item" key={index}>
                        <span className="contrib-name">{item.login}</span>
                        <span className="contrib-number">
                          Number of contributes:
                          {item.contributions}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
