import React from 'react'
import ContentLoader from 'react-content-loader'

const ImageGrid = props => (
  <ContentLoader
    speed={2}
    width={1500}
    height={575}
    viewBox="0 0 1500 575"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="9" rx="2" ry="2" width="1500" height="10" />
    <rect x="0" y="30" rx="2" ry="2" width="1500" height="11" />
    <rect x="52" y="58" rx="2" ry="2" width="211" height="341" />
    <rect x="280" y="57" rx="2" ry="2" width="211" height="341" />
    <rect x="507" y="56" rx="2" ry="2" width="211" height="341" />
    <rect x="735" y="55" rx="2" ry="2" width="211" height="341" />
    <rect x="962" y="54" rx="2" ry="2" width="211" height="341" />
    <rect x="1189" y="53" rx="2" ry="2" width="211" height="341" />
    <circle cx="286" cy="536" r="12" />
    <circle cx="319" cy="535" r="12" />
    <circle cx="353" cy="535" r="12" />
    <rect x="378" y="524" rx="0" ry="0" width="52" height="24" />
    <rect x="210" y="523" rx="0" ry="0" width="52" height="24" />
    <circle cx="210" cy="535" r="12" />
    <circle cx="428" cy="536" r="12" />
  </ContentLoader>
)

ImageGrid.metadata = {
  name: 'Hassan Tijani.A',
  github: 'surepeps',
  description: 'Image Grid with Pagination',
  filename: 'ImageGrid',
}

export default ImageGrid
