/**
 * @typedef ApiResponse
 * @property {number} code
 * @property {string} msg
 * @property {*} data
 */

/**
 * @typedef Inscription
 * @property {string} inscriptionId
 * @property {number} inscriptionNumber
 * @property {boolean} isBRC20
 * @property {boolean} moved
 * @property {number} offset
 */

/**
 * @typedef Atomical
 * @property {string} atomicalId
 * @property {number} atomicalNumber
 * @property {boolean} isARC20
 * @property {string} ticker
 */

/**
 * @typedef UTXO
 * @property {string} address
 * @property {number} codeType
 * @property {number} height
 * @property {number} idx
 * @property {Inscription[]} inscriptions
 * @property {Atomical[]} atomicals
 * @property {boolean} isOpInRBF
 * @property {number} satoshi
 * @property {string} scriptPk
 * @property {string} scriptType
 * @property {string} txid
 * @property {number} vout
 */

/**
 * @typedef TickerDetail
 * @property {number} completeBlocktime
 * @property {number} completeHeight
 * @property {string} confirmedMinted
 * @property {string} confirmedMinted1h
 * @property {string} confirmedMinted24h
 * @property {string} creator
 * @property {number} decimal
 * @property {number} deployBlocktime
 * @property {number} deployHeight
 * @property {number} historyCount
 * @property {number} holdersCount
 * @property {string} inscriptionId
 * @property {number} inscriptionNumber
 * @property {number} inscriptionNumberEnd
 * @property {number} inscriptionNumberStart
 * @property {string} limit
 * @property {string} max
 * @property {number} mintTimes
 * @property {string} minted
 * @property {string} ticker
 * @property {string} totalMinted
 * @property {string} txid
 */

/**
 * @typedef InscribeSummary
 * @property {number} inscribeCount
 * @property {number} ogPassConfirmations
 * @property {number} ogPassCount
 * @property {number} satsCount
 * @property {number} unisatCount
 */
