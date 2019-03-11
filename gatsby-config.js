module.exports = {
  siteMetadata: {
    title: 'dflate.io',
    author: 'Gregor Weber',
    description:
      'Personal blog by Gregor Weber. Thoughts that need to get out.',
    siteUrl: 'https://dflate.io',
    social: {
      twitter: '@gr__or',
    },
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: __dirname + '/src/pages',
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [require(`postcss-preset-env`)({ stage: 0 })],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
              showCaptions: true,
              withWebp: true,
            },
          },
          'gatsby-remark-embed-video', // has to be before responsive-iframe
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              inlineCodeMarker: '÷',
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
          'gatsby-plugin-twitter',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-135927025-1',
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge => {
                const { siteUrl } = site.siteMetadata;
                const { excerpt, fields, frontmatter } = edge.node;
                const { slug } = fields;

                const html = edge.node.html
                  .replace(/href="\//g, `href="${siteUrl}/`)
                  .replace(/src="\//g, `src="${siteUrl}/`)
                  .replace(/"\/static\//g, `"${siteUrl}/static/`)
                  .replace(/,\s*\/static\//g, `,${siteUrl}/static/`);
                const url = siteUrl + '/' + slug;
                const postText = `
                  <div style="margin-top=55px; font-style: italic;">(This is an article posted to my blog at dflate.io. You can read it online by <a href="${url}">clicking here</a>.)</div>
                `;

                return {
                  ...frontmatter,
                  description: excerpt,
                  date: frontmatter.date,
                  url,
                  guid: url,
                  custom_elements: [{ 'content:encoded': html + postText }],
                };
              }),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] }
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 250)
                      html
                      fields { 
                        slug   
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Gregor Webers's dflate.io Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Dflate',
        short_name: 'Dflate',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#5690ff',
        display: 'minimal-ui',
        icon: 'src/assets/icon.png',
        theme_color_in_head: false,
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    'gatsby-plugin-catch-links',
  ],
};
