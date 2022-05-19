import React from 'react';
import '../node_modules/dotenv/config' 
import './App.css';
import {Route, Switch} from 'react-router-dom';

 
//import multiple components into the app
import Upload from './components/MainComponents/upload.component';
import DashBoard from './components/MainComponents/dashboard.component';
import PLD from './components/MainComponents/PreLoadingData.component';
import SD from './components/DependentComponents/SingleDevice.component';
import SE from './components/DependentComponents/SingleException.component';
import Start from './Start';

function App() {
  return (
    <div className="app">
        <Switch>
          <Route exact path="/" component={Start} />
          <Route path="/dashboard" component={DashBoard} />
          <Route path="/load/data" component={PLD} />
          <Route path="/audit/device/:cpykey/:a1/:a2/:dev" render = {(props) => {
            let cpykey = props.match.params.cpykey;
            let a1 = props.match.params.a1;
            let a2 = props.match.params.a2;
            let e = props.match.params.dev;
            return(
              <SD data = {{
                "cpykey":cpykey,
                "a1":a1,
                "a2":a2,
                "e":e
              }}/>
            )
          }} />
          <Route path="/audit/exception/:cpykey/:a1/:a2/:e" render = {(props) => {
              let cpykey = props.match.params.cpykey;
              let a1 = props.match.params.a1;
              let a2 = props.match.params.a2;
              let e = props.match.params.e;
              return(
                <SE data = {{
                  "cpykey":cpykey,
                  "a1":a1,
                  "a2":a2,
                  "e":e
                }}/>
              )
          }}/>
        </Switch>
    </div>
  );
}

export default App;
