import React from "react";
import Signup from "./components/Signup";
import Adminprofile from "./components/Admin/Adminprofile";
import Foliodetail from "./components/Admin/Foliodetail";
import Transaction from "./components/Admin/Transaction";
import Taxsavinginvest from "./components/Admin/Taxsavinginvest";
import Sipstp from "./components/Admin/Sipstp";
import Portfolio from "./components/Admin/Portfolio";
import Datamanagement from "./components/Admin/Datamanagement";
import Clientmapping from "./components/Admin/Client-mapping";
import Portfoliodetail from "./components/Admin/Portfoliodetail";
import Edituser from "./components/Admin/Edituser";
import Uploadclientmappingtranskarvy from "./components/Admin/Uploadclientmappingtranskarvy";
import Uploadclientmappingtranscams from "./components/Admin/Uploadclientmappingtranscams";
import Uploadclientmappingtranscams2A from "./components/Admin/Uploadclientmappingtranscams2A";
import Uploadclientmappingfoliocams from "./components/Admin/Uploadclientmappingfoliocams";
import Uploadclientmappingfoliokarvy from "./components/Admin/Uploadclientmappingfoliokarvy";
import Foliofiles from "./components/Admin/Foliofiles";
import Dividend from "./components/Admin/Dividend";
import Nav from "./components/Admin/Nav";
import Transactionfeed from "./components/Admin/Transactionfeed";
import Usercreate from "./components/Admin/Usercreation";
import Listuser from "./components/Admin/Alluser";
import Login from "./components/Login";
import Home from "./Home.js";
import Transactiondetail from "./components/Admin/Transaction-detail";
import Datafoliodetail from "./components/Admin/Datafolio-detail";
import AdminNavBar from "./Adminnav";
import Sidebar from "./Adminsidebar";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

const App = () => {
//  alert(localStorage.getItem("user"));
  return (
    <>

  
         <BrowserRouter>
        <AdminNavBar />
         <Sidebar />
         
           <Switch>
           
           <Route exact path="/" component={Login} />
           <Route exact path="/Login" component={Login} />
             <Route exact path="/Home" component={Home} />
             <Route exact path="/Adminprofile" component={Adminprofile} />
             <Route exact path="/Datamanagement" component={Datamanagement} />
             <Route exact path="/Client_mapping" component={Clientmapping} />
             <Route exact path="/Foliodetail" component={Foliodetail} />
             <Route exact path="/Transaction" component={Transaction} />
             <Route exact path="/Sipstp" component={Sipstp} />
             <Route exact path="/Portfolio" component={Portfolio} />
             <Route exact path="/Portfoliodetail" component={Portfoliodetail} />
             <Route exact path="/edituser" component={Edituser} />
             <Route exact path="/Uploadclientmappingtranskarvy"component={Uploadclientmappingtranskarvy}/>
             <Route exact path="/Uploadclientmappingtranscams" component={Uploadclientmappingtranscams} />
             <Route exact path="/Uploadclientmappingtranscams2A" component={Uploadclientmappingtranscams2A} />
             <Route exact path="/Uploadclientmappingfoliocams" component={Uploadclientmappingfoliocams} />
             <Route exact path="/Uploadclientmappingfoliokarvy" component={Uploadclientmappingfoliokarvy} />
             <Route exact path="/Taxsavinginvest" component={Taxsavinginvest} />
             <Route exact path="/Foliofiles" component={Foliofiles} />
             <Route exact path="/Dividend" component={Dividend} />
             <Route exact path="/nav" component={Nav} />
             <Route exact path="/Transactionfeed" component={Transactionfeed} />
             <Route exact path="/Usercreate" component={Usercreate} />
             <Route exact path="/Listuser" component={Listuser} />
             <Route exact path="/Signup" component={Signup} />
             <Route exact path="/Transaction-detail" component={Transactiondetail} />
             <Route exact path="/Datafolio-detail" component={Datafoliodetail} />
             
           </Switch>
           </BrowserRouter>
     
  
   
    </>
  );
};

export default App;
