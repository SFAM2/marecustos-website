export default {
  reactStrictMode: false,
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      ...['about', 'applications', 'industries', 'contact', 'privacy', 'terms'].map((page) => ({
        source: `/${page}.html`, destination: `/${page}`, permanent: true,
      })),
    ];
  },
};
