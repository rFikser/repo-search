import React from "react";
import "./App.css";
import { MainPage } from "./components/MainPage";
import { Route } from "react-router-dom";
import { SecondPage } from "./components/SecondPage";

function App() {
  return (
    <div className="App">
      <Route
        exact
        path="/:pageNumber?"
        render={(props) => <MainPage {...props} />}
      ></Route>
      <Route
        exact
        path="/rep/:id"
        render={(props) => <SecondPage {...props} />}
      ></Route>
    </div>
  );
}

export default App;
