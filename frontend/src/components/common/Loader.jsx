import React from 'react';
import Navbar from './Navbar';

export default function Loader({ fullPage = true }) {
  const loaderContent = (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-text-container">
          <h2 className="loader-title">Loading...</h2>
        </div>
        <div className="loader-animation-area">
          <div className="loader-track-wrapper">
            <div className="loader-rider-container">
              <img 
                alt="Delivery Rider" 
                className="loader-rider-img" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7OcINmWPry879FJoQL8NCy01VeVpoAT4WQOlZ-Ak_XE5oPSZEmpIADsEwjap0QpD5xopu-3yfBk04Ax-ki09VVYdV1I_VDqk3KJxiV5i6TqX9h_Xf1Jt188ZNuiQ6xJutsO9eAAPreivq0P69D65FoqvT1NxfYUW7iL7IR1Ti0vzQLrAE8NkKAUMN6FVvksddCKSgPsPII8hSp3RGpigypmY-ZmDEWwtrzqSngioe7xhyfgocu2IDfgByztQo3ebqkQ"
              />
            </div>
            <div className="loader-track">
              <div className="loader-progress"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="loader-bg-glow"></div>
    </div>
  );

  if (fullPage) {
    return (
      <>
        <Navbar />
        {loaderContent}
      </>
    );
  }

  return loaderContent;
}
