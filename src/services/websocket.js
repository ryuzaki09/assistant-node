import WebSocket from 'ws'
import {haInstance} from '../lib/ha.js'

const HA_WS_URL = `ws://${process.env.HA_HOST}:8123/api/websocket`
const HA_LONG_LIVE_TOKEN = process.env.HA_LONG_LIVE_TOKEN

const homeAssistant = haInstance.getHomeAssistantInstance()
let homeAssistantConversationId = 3

const ws = new WebSocket(HA_WS_URL)
let conversationId = undefined

const start = () => {
  ws.on('open', () => {
    console.log('Connected to Home Assistant Web Socket')

    ws.send(
      JSON.stringify({
        type: 'auth',
        access_token: HA_LONG_LIVE_TOKEN
      })
    )

    setTimeout(() => {
      ws.send(
        JSON.stringify({
          id: 1,
          type: 'get_states'
        })
      )
      ws.send(
        JSON.stringify({
          id: 2,
          type: 'get_services'
        })
      )
    })
  })

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data)
    if (parsedData.id === 1) {
      console.log('Results: ', parsedData.result.length)
      const lights = getAllLightsAndSwitches(parsedData.result)
      // console.log('Lights: ', lights)
      homeAssistant.lights = lights
      // console.log('Lights: ', homeAssistant.lights)
    } else if (parsedData.id === 2) {
      // console.log('Services: ', Object.keys(parsedData.result))
    } else if (parsedData.id > 2) {
      console.log('conversation: ', parsedData)
      if (parsedData.result?.conversation_id && !conversationId) {
        conversationId = parsedData.result?.conversation_id
        // Home assistant requires Id to be incremented/different each time the conversation API is called.
        homeAssistantConversationId = homeAssistantConversationId + 1

      }
    } else {
      console.log('📩 Received: ', JSON.parse(data))
    }
  })
}

const sendConversation = (text) => {
  const data = {
    id: homeAssistantConversationId,
    type: 'conversation/process',
    text,
    language: 'en',
    ...(conversationId && {conversation_id: conversationId})
  }
  //console.log('converse data: ', data)
  ws.send(JSON.stringify(data))
}

function getAllLightsAndSwitches(data) {
  return data.filter(
    (entity) =>
      entity.entity_id.startsWith('light') ||
      entity.entity_id.startsWith('switch')
  )
}

export const websocket = {
  start,
  sendConversation
}
