// src/shopify/client.js
// Shopify Admin API GraphQL client
// Uses Admin API (not Storefront) for full metafield + catalog access

require('dotenv').config();
const fetch = require('node-fetch');

const SHOPIFY_ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

async function shopifyQuery(query, variables = {}) {
  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }
  return data.data;
}

// Fetch all products with full metafield architecture
async function getAllProducts() {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            status
            priceRangeV2 {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            images(first: 3) {
              edges { node { url altText } }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price
                  availableForSale
                  inventoryQuantity
                }
              }
            }
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                  type
                }
              }
            }
            tags
          }
        }
      }
    }
  `;

  const data = await shopifyQuery(query, { first: 100 });
  return data.products.edges.map(({ node }) => parseProduct(node));
}

// Fetch single product by handle
async function getProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id title description handle
        priceRangeV2 {
          minVariantPrice { amount currencyCode }
        }
        images(first: 1) { edges { node { url altText } } }
        variants(first: 1) {
          edges { node { id price availableForSale } }
        }
        metafields(first: 10) {
          edges { node { namespace key value type } }
        }
        tags
      }
    }
  `;
  const data = await shopifyQuery(query, { handle });
  if (!data.productByHandle) return null;
  return parseProduct(data.productByHandle);
}

// Parse raw Shopify product into ShopMind format
function parseProduct(node) {
  const metafields = {};
  (node.metafields?.edges || []).forEach(({ node: mf }) => {
    metafields[`${mf.namespace}.${mf.key}`] = mf.value;
  });

  const price = parseFloat(
    node.priceRangeV2?.minVariantPrice?.amount ||
    node.variants?.edges?.[0]?.node?.price || 0
  );

  const variantId = node.variants?.edges?.[0]?.node?.id || null;
  const available = node.variants?.edges?.[0]?.node?.availableForSale !== false;

  return {
    id: node.id,
    variantId,
    title: node.title,
    description: node.description || '',
    handle: node.handle,
    price,
    priceFormatted: `₹${Math.round(price).toLocaleString('en-IN')}`,
    available,
    image: node.images?.edges?.[0]?.node?.url || null,
    tags: node.tags || [],
    // ShopMind metafields
    emotionTags: parseList(metafields['shopmind.emotion_tags']),
    personas: parseList(metafields['shopmind.persona']),
    occasions: parseList(metafields['shopmind.occasion']),
    moodTiles: parseList(metafields['shopmind.mood_tiles']),
    socialProof: parseJSON(metafields['shopmind.social_proof']),
    complementaryHandles: parseList(metafields['shopmind.complementary']),
    regretObjection: metafields['shopmind.regret_objection'] || null,
    regretAnswer: metafields['shopmind.regret_answer'] || null,
  };
}

function parseList(val) {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()); }
}

function parseJSON(val) {
  if (!val) return null;
  try { return JSON.parse(val); } catch { return null; }
}

// Create cart / draft order with a product variant
async function createDraftOrder(variantId, quantity = 1) {
  const query = `
    mutation DraftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          invoiceUrl
          status
          totalPrice
        }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyQuery(query, {
    input: {
      lineItems: [{ variantId, quantity }],
    }
  });
  if (data.draftOrderCreate.userErrors.length) {
    throw new Error(data.draftOrderCreate.userErrors.map(e => e.message).join(', '));
  }
  return data.draftOrderCreate.draftOrder;
}

module.exports = { getAllProducts, getProductByHandle, createDraftOrder, shopifyQuery };
