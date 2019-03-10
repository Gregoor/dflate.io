import React from 'react';
import profilePic from '../assets/profile-pic.png';
import { rhythm } from '../utils/typography';

const Bio = () => (
  <div
    style={{
      display: 'flex',
      marginBottom: rhythm(2),
    }}
  >
    <img
      src={profilePic}
      alt="Gregor Weber"
      style={{
        marginRight: rhythm(1 / 2),
        marginBottom: 0,
        width: rhythm(2),
        height: rhythm(2),
        borderRadius: '50%',
      }}
    />
    <p style={{ maxWidth: 310 }}>
      Personal blog by <a href="https://mobile.twitter.com/gr__or">Gregor</a>.
      <br />
      Thoughts that need to get out.
    </p>
  </div>
);

export default Bio;
