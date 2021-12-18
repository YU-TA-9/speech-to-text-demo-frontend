import * as React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Demo } from "./pages/demo";
import { Home } from "./pages/home";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/demo" component={Demo} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
