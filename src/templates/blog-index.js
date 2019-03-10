import { graphql, Link } from 'gatsby';
import React from 'react';
// import Bio from '../components/Bio';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm } from '../utils/typography';

const BlogIndexTemplate = ({ data, location }) => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <SEO />
    {/*<aside>*/}
    {/*<Bio />*/}
    {/*</aside>*/}
    <main>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <article key={node.fields.slug}>
          <header>
            <h3
              style={{
                fontSize: rhythm(1),
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link
                style={{ boxShadow: 'none' }}
                to={node.fields.slug}
                rel="bookmark"
              >
                {node.frontmatter.title || node.fields.slug}
              </Link>
            </h3>
            <small>
              {formatPostDate(node.frontmatter.date)}
              {' • '}
              {formatReadingTime(node.timeToRead)}
            </small>
          </header>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </article>
      ))}
    </main>
    <Footer />
  </Layout>
);

export default BlogIndexTemplate;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;
