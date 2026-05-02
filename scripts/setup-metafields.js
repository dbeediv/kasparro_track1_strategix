// scripts/setup-metafields.js
// Registers ShopMind metafield definitions on the Shopify store
// Run ONCE before seeding: npm run setup
// This creates the metafield namespace/key definitions so the Admin API accepts them

require('dotenv').config();
const { shopifyQuery } = require('../src/shopify/client');

const METAFIELD_DEFINITIONS = [
  {
    name: 'Emotion Tags',
    namespace: 'shopmind',
    key: 'emotion_tags',
    description: 'ShopMind emotion tags — e.g. ["warmth","calm","luxury"]',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Persona',
    namespace: 'shopmind',
    key: 'persona',
    description: 'ShopMind buyer personas — e.g. ["picky-mom","wellness-seeker"]',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Occasion',
    namespace: 'shopmind',
    key: 'occasion',
    description: 'ShopMind occasions — e.g. ["birthday","anniversary","just-because"]',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Mood Tiles',
    namespace: 'shopmind',
    key: 'mood_tiles',
    description: 'ShopMind mood canvas tiles — e.g. ["warm","minimal","handmade"]',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Social Proof',
    namespace: 'shopmind',
    key: 'social_proof',
    description: 'Persona-matched social proof — {quote, persona}',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Complementary Products',
    namespace: 'shopmind',
    key: 'complementary',
    description: 'Handles of complementary products for L9 upsell',
    type: 'json',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Regret Objection',
    namespace: 'shopmind',
    key: 'regret_objection',
    description: 'Most likely reason a buyer would return this product (L8)',
    type: 'single_line_text_field',
    ownerType: 'PRODUCT',
  },
  {
    name: 'Regret Answer',
    namespace: 'shopmind',
    key: 'regret_answer',
    description: 'Proactive answer to the regret objection (L8)',
    type: 'single_line_text_field',
    ownerType: 'PRODUCT',
  },
];

const CREATE_DEFINITION = `
  mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id name namespace key }
      userErrors { field message code }
    }
  }
`;

async function setup() {
  console.log('\n🔧  Setting up ShopMind metafield definitions...\n');
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const def of METAFIELD_DEFINITIONS) {
    try {
      process.stdout.write(`  → ${def.namespace}.${def.key} (${def.type})... `);
      const data = await shopifyQuery(CREATE_DEFINITION, { definition: def });
      const result = data.metafieldDefinitionCreate;

      if (result.userErrors.length) {
        const alreadyExists = result.userErrors.some(e =>
          e.message.toLowerCase().includes('already') ||
          e.code === 'TAKEN'
        );
        if (alreadyExists) {
          console.log('already exists ✓');
          skipped++;
        } else {
          console.log(`✗ ${result.userErrors.map(e => e.message).join(', ')}`);
          failed++;
        }
      } else {
        console.log('created ✓');
        created++;
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅  Setup complete.`);
  console.log(`   Created: ${created}  |  Already existed: ${skipped}  |  Failed: ${failed}`);
  if (failed > 0) {
    console.log('\n⚠️  Some definitions failed. Check your Admin API scopes include:');
    console.log('   write_products, read_products, write_product_listings\n');
  } else {
    console.log('\n🌱  Now run: npm run seed\n');
  }
}

setup().catch(err => {
  console.error('\n❌  Setup failed:', err.message);
  console.error('Check your .env file — SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN must be set.\n');
  process.exit(1);
});
