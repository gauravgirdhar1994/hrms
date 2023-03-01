import React from 'react'
import ContentLoader from 'react-content-loader'

const DashboardLoader = props => (
  <ContentLoader
    speed={2}
    width={1500}
    height={200}
    viewBox="0 0 1500 200"
    backgroundColor="#eaeced"
    foregroundColor="#ffffff"
    {...props}
  >
    <rect x="68" y="37" rx="3" ry="3" width="298" height="129" />
    <rect x="426" y="37" rx="3" ry="3" width="298" height="129" />
    <rect x="786" y="37" rx="3" ry="3" width="298" height="129" />
    <rect x="1146" y="37" rx="3" ry="3" width="298" height="129" />
  </ContentLoader>
)

DashboardLoader.metadata = {
  name: 'Sridhar Easwaran',
  github: 'sridhareaswaran',
  description: 'Dashboard pages',
  filename: 'DashboardLoader',
}

export default DashboardLoader