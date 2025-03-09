/**
 * @typedef {Object} Product
 * @property {string} id - ID produktu
 * @property {string} sku - SKU produktu
 * @property {string} name - Název produktu
 * @property {string} description - Popis produktu
 * @property {string} created_at - Datum vytvoření
 * @property {string} client_id - ID klienta
 */

/**
 * @typedef {Object} Batch
 * @property {string} id - ID produktu
 * @property {string} batch_number - SKU produktu
 * @property {string} expiration_date - Název produktu
 * @property {string} created_at - Datum vytvoření
 * @property {string} product_id - ID produktu
 */

/**
 * @typedef {Object} Client
 * @property {string} id - ID klienta
 * @property {string} name - Jméno klienta
 */

/**
 * @typedef {Object} User
 *   @property {list} client_id
 *   @property {string} name
 *   @property {string} email
 */

/**
 * @typedef {Object} Box
 *   @property {string} ean
 *   @property {number} width
 *   @property {number} height
 *   @property {number} depth
 *   @property {number} weight
 *   @property {string} position_id
 */

/**
 * @typedef {Object} Position
 *   @property {string} name
 *   @property {string} warehouse_id
 */

/**
 * @typedef {Object} Group
 *   @property {number} quantity
 *   @property {string} box_id
 *   @property {string} batch_id
 */

/**
 * @typedef {Object} Warehouse
 *   @property {string} name
 *   @property {string} description
 *   @property {string} city
 *   @property {string} state
 *   @property {string} address
 *   @property {string} psc
 */

/**
 * @typedef {Object} Operation
 *   @property {string} number
 *   @property {string} description
 *   @property {string} type
 *   @property {string} status
 *   @property {string} groups_id
 */
