// src/routes/cart.js
const express = require('express');
const router = express.Router();
const { createDraftOrder } = require('../shopify/client');

// POST /api/cart/add — L5: Frictionless cart path
router.post('/add', async (req, res) => {
  const { variantId, quantity } = req.body;

  if (!variantId) {
    return res.status(400).json({ error: 'variantId is required' });
  }

  try {
    const draftOrder = await createDraftOrder(variantId, quantity || 1);
    res.json({
      success: true,
      checkoutUrl: draftOrder.invoiceUrl,
      orderId: draftOrder.id,
      totalPrice: draftOrder.totalPrice,
    });
  } catch (err) {
    console.error('[Cart] Error creating draft order:', err.message);
    res.status(500).json({ success: false, error: 'Could not create cart. Please try again.' });
  }
});

module.exports = router;
