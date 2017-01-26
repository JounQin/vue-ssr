import config, {globals} from './base'

export * from './base'
export default {...config, ...require(`./${globals.NODE_ENV}`).default(config)}
