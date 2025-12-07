import React from "react";
import Ghostsquad from "../assets/ghostsquad.png";
import "./welcome.css"; // 👈 corrected import

function Welcome() {
  return (
    <div>
      <img src={Ghostsquad} className="ghostimage" alt="Ghost Squad" />
      <h1>
        Welcome Guest to Team5 Ghost Squad UI Extensions for CG User Interface.
      </h1>
      <h2 class="sitedetails">
        We have migrated to the Vite Compiler to Support Hosting Deployments which is more robust.
      </h2>
        <h2 class="sitedetails">
        We have added Material UI as a new template option for styling for the header and footer which look much nicer and have default cart Images.
      </h2>
        
      <h2 class="sitedetails">
        Hosting Environment using Apache24 on Debian Linux 13 running NodeJS 24 with Yarn. Builds run with yarn vitebuild. Preview with yarn vitepreview.
      </h2>
       <h2 class="sitedetails">
       We have a new member of the Ghost Squad Team as we have incorporated some menu code from 547Fall2024... welcome to the spirit world Jackson.</h2>
      <h2 class="sitedetails"> We have a new User, and Registration page. Which is different from the rest of the code base. </h2>
        
    </div>
  );
}

export default Welcome;
