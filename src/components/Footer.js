import React from 'react';
import { rhythm } from '../utils/typography';

const Footer = () => (
  <footer
    style={{
      marginTop: rhythm(1.5),
      paddingTop: rhythm(1),
    }}
  >
    <div style={{ float: 'right' }}>
      <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
        RSS
      </a>
    </div>
    <a
      href="https://mobile.twitter.com/gr__or"
      target="_blank"
      rel="noopener noreferrer"
    >
      Twitter
    </a>
    {' / '}
    <a
      href="https://github.com/Gregoor"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
    {' / '}
    <a
      href="mailto:gregorwbr@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      E-Mail
    </a>
  </footer>
);

export default Footer;
