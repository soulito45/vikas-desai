import { sampleProjects } from './projects.js'
import { sampleProperties } from './properties.js'
import { blogPosts } from './blog.js'
import { reviews } from './reviews.js'
import { services } from './services.js'

// One complete baseline keeps the dashboard and public pages structurally aligned.
// Icon components cannot cross the HTTP boundary. The client reattaches them by id.
export const adminSeed = {
  projects: sampleProjects,
  properties: sampleProperties,
  blogPosts,
  reviews,
  services: services.map(({ icon: _icon, ...service }) => service),
}
