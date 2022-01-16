import React from "react";
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <div className="font-small pt-4 " style={{backgroundColor:'#040B1C', color:"white",width:'100%'}}>
      <div className="text-center pl-5 text-md-left container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <h3 className="title">Meet the developer</h3>
              <p><i className="fa fa-user" aria-hidden="true"></i> Rohan Dutt</p>
              <p><i className="fa fa-phone" aria-hidden="true"></i> 9634886259</p>
              <p><i className="fa fa-envelope" aria-hidden="true"></i> duttrohan0302@gmail.com</p>
              <p><i className="fa fa-github" aria-hidden="true"></i>&nbsp;<a href='https://github.com/duttrohan0302'>cyberRohan</a></p>
              <p><i className="fa fa-linkedin" aria-hidden="true"></i>&nbsp;<a href='https://www.linkedin.com/in/rohandutt0302/'>Rohan Dutt</a></p>

          </div>
          <div className="col-sm-6">
            <ul>
              <li className="list-unstyled">
                <h4>Links</h4>
              </li>
              <li className="list-unstyled">
                <Link to="/">Home</Link>
              </li>
              <li className="list-unstyled">
                <Link to="/receivedInvitations">See Received Invitations</Link>
              </li>
              <li className="list-unstyled">
                <Link to="/sentInvitations">See Sent Invitations</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright pl-5 py-1" style={{backgroundColor:'white',color:'black'}}>
        
      </div>
    </div>
  );
}

export default Footer;