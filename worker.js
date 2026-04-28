const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS })

    try {
      const { amount } = await request.json()

      const identifier = 'doacao_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

      const client = {
        name: 'Irmãos de oração',
        email: 'deoracoes@irmaos.com.br',
        phone: '+5511991596266',
        document: '24121260899'
      }

      const payload = {
        identifier,
        amount: parseFloat(amount),
        client,
        products: [{ id: 'doacao', name: 'Irmãos de oração', quantity: 1, price: parseFloat(amount) }],
        metadata: { provider: 'Site', type: 'doacao' }
      }

      const resp = await fetch('https://app.amplopay.com/api/v1/gateway/pix/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': 'deoracoesirmaos_w93jibkyy9z187o6',
          'x-secret-key': '1rw4uohqyd07am1xcrvyhkrekzh1sgttuauuiruvkryhwvismwtc477lvtfb0a8t'
        },
        body: JSON.stringify(payload)
      })

      const data = await resp.json()

      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }
  }
}
