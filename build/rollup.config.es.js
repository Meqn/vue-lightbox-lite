import base, { name } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name,
    file: `dist/${name}.esm.js`,
    format: 'es',
  },
  external: [
    ...base.external,
    /@babel\/runtime/,
  ],
})

export default config
