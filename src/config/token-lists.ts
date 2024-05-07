// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */

export const NEXUS_TOKEN_LIST = 'https://raw.githubusercontent.com/nexusportal/token-list/main/tokens.json'

export const UNSUPPORTED_LIST_URLS: string[] = []


// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  NEXUS_TOKEN_LIST
  // ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [NEXUS_TOKEN_LIST]
