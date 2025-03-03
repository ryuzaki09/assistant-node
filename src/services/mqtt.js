import mqtt from 'mqtt'

const mqttClient = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST}:1883`, 
  {username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD}
);

export const mqttService = {
  sendToHomeAssistant: (text) => {
    mqttClient.publish("homeassistant/voice/incoming", text)
  }
}

mqttClient.subscribe("homeassistant/voice/outgoing")

mqttClient.on('message', (topic, message) => {
  if (topic === 'homeassistant/voice/outgoing') {
    console.log('Home Assistant response: ', message.toString())
  }
})
