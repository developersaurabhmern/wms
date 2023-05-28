import React from "react";

const Sidebar = () => {

    return (
      <>
     <style jsx>
{`
.side_p{
color:#fff;
font-size:14px;
}
`}
</style>
        {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="Admin" className="brand-link">
          {/* <img src="http://pubweb.bfcgroup.in/images/logos/bfc-publications-logo.png" alt="AdminLTE Logo" className="brand-image elevation-3"/> */}
          <span className="brand-text font-weight-light">WMS</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library */}
              <li className="nav-item has-treeview menu-open">
                <a href="Admin" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p className="side_p">
                    Dashboard
                  </p>
                </a>
              </li>



              <li className="nav-item has-treeview">
                    <a href="#" className="nav-link">
                          <i className="nav-icon fas fa-upload" />
                          <p className="side_p">
                          Upload
                          <i className="right fas fa-angle-left" />
                          </p>
                    </a>
                          <ul className="nav nav-treeview">
                          <li className="nav-item">
                          <a href="Foliofiles" className="nav-link">
                          <i className="nav-icon fas fa-angle-right" />
                          <p className="side_p">Upload Masterfolio</p>
                          </a>
                          </li>
                          <li className="nav-item">
                          <a href="Transactionfeed" className="nav-link">
                          <i className="nav-icon fas fa-angle-right" />
                          <p className="side_p">Upload Transaction Feeds</p>
                          </a>
                          </li>
                          <li className="nav-item">
                          <a href="Nav" className="nav-link">
                          <i className="nav-icon fas fa-angle-right" />
                          <p className="side_p">Upload NAV</p>
                          </a>
                          </li>
                          </ul>
                    </li>


              {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="image">
                  <img src="../../dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"/>
                </div>
                <div className="info">
                  <a href="Adminprofile" className="d-block">Admin</a>
                </div>
              </div> */}
              {/* book list */}
              {/* <li className="nav-item has-treeview">
                <a href="Foliofiles" className="nav-link">
                  <i className="nav-icon fas fa-chart-line" />
                  <p className="side_p">Upload Masterfolio</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Transactionfeed" className="nav-link">
                  <i className="nav-icon fas fa-chart-line" />
                  <p className="side_p">Upload Transaction Feeds</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Nav" className="nav-link">
                  <i className="nav-icon fas fa-chart-line" />
                  <p className="side_p">Upload NAV</p>
                </a>
              </li> */}
              
              {/* <li className="nav-item has-treeview">
                <a href="Foliodetail" className="nav-link">
                  <i className="nav-icon fas fa-road" />
                  <p className="side_p">My Journey So Far</p>
                </a>
              </li> */}
              <li className="nav-item has-treeview">
                <a href="Sipstp" className="nav-link">
                  <i className="nav-icon fas fa-signal" />
                  <p className="side_p">SIP/STP</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Transaction" className="nav-link">
                  <i className="nav-icon fas fa-exchange-alt" />
                  <p className="side_p">Transaction</p>
                </a>
              </li>
             
              <li className="nav-item has-treeview">
                <a href="Taxsavinginvest" className="nav-link">
                  <i className="nav-icon fas fa-life-ring" />
                  <p className="side_p">Tax Saving Investments</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Dividend" className="nav-link">
                  <i className="nav-icon fas fa-university" />
                  <p className="side_p">Dividends</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Foliodetail" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p className="side_p">Folio Details</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Portfolio" className="nav-link">
                  <i className="nav-icon fas fa-chart-line" />
                  <p className="side_p">Portfolio</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Datamanagement" className="nav-link">
                  <i className="nav-icon fa fa-database" />
                  <p className="side_p">Data Management</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="Client_mapping" className="nav-link">
                  <i className="nav-icon fa fa-file" />
                  <p className="side_p">Client Mapping</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                    <a href="#" className="nav-link">
                          <i className="nav-icon fas fa-user-alt" />
                          <p className="side_p">
                          User
                          <i className="right fas fa-angle-left" />
                          </p>
                    </a>
                          <ul className="nav nav-treeview">
                          <li className="nav-item">
                          <a href="Listuser" className="nav-link">
                          <i className="nav-icon fas fa-angle-right" />
                          <p className="side_p">All User</p>
                          </a>
                          </li>
                          <li className="nav-item">
                          <a href="Usercreate" className="nav-link">
                          <i className="nav-icon fas fa-angle-right" />
                          <p className="side_p">Create User</p>
                          </a>
                          </li>
                          
                          </ul>
                    </li>
              {/* <li className="nav-item has-treeview">
                <a href="" className="nav-link">
                  <i className="nav-icon fas fa-wrench" />
                  <p className="side_p">Create Mandate</p>
                </a>
              </li>
              <li className="nav-item has-treeview">
                <a href="" className="nav-link">
                  <i className="nav-icon fas fa-wrench" />
                  <p className="side_p">Create Password</p>
                </a>
              </li> */}
            </ul>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
      </>
    );
};
export default Sidebar;
