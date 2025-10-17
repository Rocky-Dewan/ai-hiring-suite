import { Router } from 'express'
const router = Router()

// Generic webhook receiver for services like Judge0 or other external callbacks
router.post('/judge0', async (req, res) => {
  // For production verify signature/header
  try {
    const payload = req.body
    console.log('judge0 webhook', payload)
    // TODO: update assessment result record in DB
    res.json({ ok: true })
  } catch (e) {
    console.error('webhook error', e)
    res.status(500).json({ error: 'webhook handling failed' })
  }
})

export default router
