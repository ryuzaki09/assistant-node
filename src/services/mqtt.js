import mqtt from 'mqtt'

const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:1883`, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
})

const deviceConfig = {
  name: 'Node AI Assistant',
  unique_id: 'ai_assistant_01',
  state_topic: 'homeassistant/voice/state',
  command_topic: 'homeassistant/voice/incoming',
  availability_topic: 'homeassistant/voice/status',
  device: {
    identifiers: ['ai_assistant_01'],
    name: 'Node AI Voice Assistant',
    manufacturer: 'Custom',
    model: 'Node.js AI Assistant'
  }
}

//mqttClient.publish(
  //'homeassistant/binary_sensor/node_assistant/config',
  //JSON.stringify(deviceConfig),
  //{retain: true}
//)

export const mqttService = {
  sendToHomeAssistant: (text) => {
    mqttClient.publish('homeassistant/voice/incoming', text)
  }
}

mqttClient.subscribe('homeassistant/voice/outgoing')

mqttClient.on('message', (topic, message) => {
  if (topic === 'homeassistant/voice/outgoing') {
    console.log('Home Assistant response: ', message.toString())
  }
})
