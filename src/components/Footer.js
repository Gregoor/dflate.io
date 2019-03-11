import React from 'react';
import { rhythm } from '../utils/typography';

const Footer = () => (
  <footer
    style={{
      marginTop: rhythm(2.5),
      paddingTop: rhythm(1),
    }}
  >
    <div style={{ float: 'right' }}>
      <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
        rss
      </a>
    </div>
    <a
      href="https://mobile.twitter.com/gr__or"
      target="_blank"
      rel="noopener noreferrer"
    >
      twitter
    </a>{' '}
    &bull;{' '}
    <a
      href="https://github.com/Gregoor"
      target="_blank"
      rel="noopener noreferrer"
    >
      github
    </a>{' '}
  </footer>
);

export default Footer;
