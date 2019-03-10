import { graphql, Link } from 'gatsby';
import React from 'react';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';

const GITHUB_USERNAME = 'gregoor';
const GITHUB_REPO_NAME = 'dflate.io';

function BlogPostTemplate(props) {
  const { data, location, pageContext } = props;
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next, slug } = pageContext;

  const editUrl = [
    'https://github.com',
    GITHUB_USERNAME,
    GITHUB_REPO_NAME,
    'edit/master/src/pages',
    slug,
    'index.md',
  ].join('/');
  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://dlate.io${slug}`
  )}`;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        slug={post.fields.slug}
      />
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-4 / 5),
              }}
            >
              {formatPostDate(post.frontmatter.date)}
              {` • ${formatReadingTime(post.timeToRead)}`}
            </p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <footer>
            <p>
              <a href={discussUrl} target="_blank" rel="noopener noreferrer">
                Discuss on Twitter
              </a>
              {` • `}
              <a href={editUrl} target="_blank" rel="noopener noreferrer">
                Edit on GitHub
              </a>
            </p>
          </footer>
        </article>
      </main>
      <aside>
        <h3
          style={{
            fontFamily: 'Helvetica Neue, Helvetica,Arial, sans-serif',
            marginTop: rhythm(0.25),
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
            dflate.io
          </Link>
        </h3>
        <Bio />
        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 250)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
      fields {
        slug
      }
    }
  }
`;
