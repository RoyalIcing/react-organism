module.exports = {
  type: 'react-component',
  webpack: {
    hoisting: true
  },
  npm: {
    esModules: true,
    umd: {
      global: 'makeOrganism',
      externals: {
        'react': 'React'
      }
    }
  }
}
