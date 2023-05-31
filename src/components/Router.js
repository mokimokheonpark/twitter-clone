import { HashRouter, Route, Switch } from "react-router-dom";
import Navigation from "components/Navigation";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";

const AppRouter = ({ isLoggedIn, userObject, refreshUser }) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation userObject={userObject} />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObject={userObject} />
            </Route>
            <Route exact path="/profile">
              <Profile userObject={userObject} refreshUser={refreshUser} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </HashRouter>
  );
};

export default AppRouter;
