import { Link } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { rhythm, scale } from '../utils/typography';
import ThemeToggle from './ThemeToggle';

class Layout extends React.Component {
  state = {
    theme: null,
  };
  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }
  renderHeader() {
    const { location, title } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;

    return location.pathname === rootPath ? (
      <h1
        style={{
          ...scale(0.75),
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'var(--textTitle)',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </h1>
    ) : (
      <h3
        style={{
          fontFamily: 'Helvetica Neue, Helvetica,Arial, sans-serif',
          marginTop: 0,
          marginBottom: 0,
          height: 42, // because
          lineHeight: '2.625rem',
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'var(--blue)',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </h3>
    );
  }
  render() {
    const { children } = this.props;

    return (
      <div
        style={{
          color: 'var(--textNormal)',
          background: 'var(--bg)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          minHeight: '100vh',
        }}
      >
        <Helmet
          meta={[
            {
              name: 'theme-color',
              content: this.state.theme === 'light' ? '#8bc7ff' : '#282c35',
            },
          ]}
        />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `2.625rem ${rhythm(3 / 4)}`,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2.625rem',
            }}
          >
            {this.renderHeader()}
            {this.state.theme !== null ? (
              <ThemeToggle
                checked={this.state.theme === 'dark'}
                onChange={e =>
                  window.__setPreferredTheme(
                    e.target.checked ? 'dark' : 'light'
                  )
                }
              />
            ) : (
              <div style={{ height: '24px' }} />
            )}
          </header>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
