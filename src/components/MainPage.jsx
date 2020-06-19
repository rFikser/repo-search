import React from "react";
import { useState, useEffect } from "react";
import { SearchItem } from "./SearchItem";
import * as axios from "axios";
import Loading from "../assets/Loading";

export const MainPage = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState();
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("Current Page")
      ? localStorage.getItem("Current Page")
      : 1
  );
  const [totalCount, setTotalCount] = useState();
  const [repPerPage] = useState(10);

  const baseURL = "https://api.github.com/search/repositories?";

  useEffect(() => {
    if (!localStorage.getItem("Search value")) {
      setLoading(true);
      axios
        .get(`${baseURL}q=stars:>100000&per_page=${repPerPage}`)
        .then((res) => {
          setLoading(false);
          const { data } = res;
          const { items } = data;
          setData(items);
        });
    } else {
      setLoading(true);
      setCurrentPage(localStorage.getItem("Current Page"));
      setSearchValue(localStorage.getItem("Search value"));
      axios
        .get(
          `${baseURL}q=${localStorage.getItem(
            "Search value"
          )}&sort=stars&per_page=${repPerPage}&page=${currentPage}`
        )
        .then((res) => {
          setLoading(false);
          const { data } = res;
          setTotalCount(data.total_count);
          const { items } = data;
          setData(items);
        });
    }
  }, []);

  const handleInput = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(`${baseURL}q=${searchValue}&sort=stars&per_page=${repPerPage}`)
      .then((res) => {
        setLoading(false);
        const { data } = res;
        setTotalCount(data.total_count);
        const { items } = data;
        setData(items);
        localStorage.setItem("Search value", searchValue);
        localStorage.setItem("Current Page", currentPage);
      });
  };

  const changePage = (pageNumber) => {
    setLoading(true);
    axios
      .get(
        `${baseURL}q=${searchValue}&sort=stars&per_page=10&page=${pageNumber}`
      )
      .then((res) => {
        setLoading(false);
        const { data } = res;
        const { items } = data;
        setData(items);
      });
    props.history.push(`/${pageNumber}`);
    setCurrentPage(pageNumber);
    localStorage.setItem("Search value", searchValue);
    localStorage.setItem("Current Page", pageNumber);
  };

  const pageNumber = Math.ceil(totalCount / repPerPage);
  const page = [];
  for (let i = 1; i <= pageNumber; i++) {
    page.push(i);
  }

  const clear = () => {
    localStorage.clear();
    window.location.reload(false);
  };

  return (
    <>
      <header className="header">
        <h1 className="header-title">
          <a className=" header-link pointer-link" href="/">
            Repositories searcher
          </a>
        </h1>
        {localStorage.getItem("Current Page") && (
          <p className="pointer-link header-link" onClick={clear}>
            CLEAR STORAGE
          </p>
        )}
      </header>

      <div className="content-box">
        <div className="container">
          <div className="content-search">
            <form onSubmit={handleSubmit} className="search-form">
              <input
                onChange={handleInput}
                className="search-input"
                type="text"
                placeholder="Search for repository"
                value={searchValue}
              />
              <button className="search-button">Submit</button>
            </form>
          </div>
        </div>
      </div>

      <div className="search-result">
        <div className="container">
          <div className="grid-container">
            <p className="search-names__titles text-left">Repository Name</p>
            <p className="search-names__titles">URL</p>
            <p className="search-names__titles">Last commit date</p>
            <p className="search-names__titles stars">Stars</p>
          </div>
          <div className="searchItemContainer">
            {isLoading ? (
              <Loading />
            ) : (
              data.map((item, index) => (
                <SearchItem data={item} history={props.history} key={index}>
                  {index}
                </SearchItem>
              ))
            )}
          </div>
          <div className="page-numbers">
            {page.slice(0, 10).map((i, index) => {
              return (
                <span
                  className={
                    currentPage === i
                      ? "page-numbers pointer-link active"
                      : "page-numbers pointer-link"
                  }
                  key={index}
                  onClick={(e) => changePage(i)}
                >
                  {i}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
