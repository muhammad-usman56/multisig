const axios = require('axios')

class RequestError extends Error {
  constructor(message, status, response) {
    super((response && response.config ? response.config.url : '') + message)
    this.status = status
    this.response = response
    this.isApiException = true
  }
}

class OpenApi {
  constructor(params) {
    this.axios = axios.create({
      baseURL: params.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
    })

    this.axios.interceptors.response.use(
      async (response) => {
        const res = response.data
        if (res.code !== 0) {
          throw new RequestError(res.msg)
        }
        return res.data
      },
      (error) => {
        if (error.response) {
          return Promise.reject(
            new RequestError(
              error.response.data,
              error.response.status,
              error.response
            )
          )
        }
        if (error.isAxiosError) {
          return Promise.reject(new RequestError('noInternetConnection'))
        }
        return Promise.reject(error)
      }
    )
  }

  async createPutOnPrepare({
    type,
    inscriptionId,
    initPrice,
    unitPrice,
    pubkey,
    marketType,
  }) {
    const response = await this.axios.post(
      `/v3/market/${type}/auction/create_put_on`,
      {
        inscriptionId,
        initPrice,
        unitPrice,
        pubkey,
        marketType,
      }
    )
    return response
  }

  async confirmPutOn({ type, auctionId, psbt, fromBase64 }) {
    const response = await this.axios.post(
      `/v3/market/${type}/auction/confirm_put_on`,
      {
        auctionId,
        psbt,
        fromBase64,
      }
    )
    return response
  }

  async createBidPrepare({ type, auctionId, bidPrice, address, pubkey }) {
    const response = await this.axios.post(
      `/v3/market/${type}/auction/create_bid_prepare`,
      {
        auctionId,
        bidPrice,
        address,
        pubkey,
      }
    )
    return response
  }

  async createBid({ type, address, auctionId, bidPrice, feeRate, pubkey }) {
    const response = await this.axios.post(
      `/v3/market/${type}/auction/create_bid`,
      {
        auctionId,
        feeRate,
        address,
        pubkey,
        bidPrice,
      }
    )
    return response
  }

  async confirmBid({
    type,
    bidId,
    psbtBid,
    psbtBid2,
    auctionId,
    psbtSettle,
    fromBase64,
  }) {
    const response = await this.axios.post(
      `/v3/market/${type}/auction/confirm_bid`,
      {
        auctionId,
        bidId,
        psbtBid,
        psbtBid2,
        psbtSettle,
        fromBase64,
      }
    )
    return response
  }

  async getInscriptionInfo(inscriptionId) {
    const response = await this.axios.get(
      `/v1/indexer/inscription/info/${inscriptionId}`
    )
    return response
  }

  async getAddressUtxoData(address, cursor = 0, size = 16) {
    const response = await this.axios.get(
      `/v1/indexer/address/${address}/utxo-data?cursor=${cursor}&size=${size}`
    )
    return response
  }

  async pushtx(txHex) {
    const response = await this.axios.post(`/v1/indexer/local_pushtx`, {
      txHex,
    })
    return response
  }
}

module.exports = { OpenApi }
