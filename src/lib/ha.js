import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const intents = yaml.load(
  fs.readFileSync(path.join(__dirname, '../config/intents.yaml'), 'utf8')
)

export const haInstance = {
  instance: null,
  getHomeAssistantInstance: () => {
    if (!haInstance.instance) {
      haInstance.instance = new HomeAssistant()
    }

    return haInstance.instance
  }
}

export class HomeAssistant {
  instance = null
  lights = []

  findIntent(speechText) {
    let sentenceWords = ''
    console.log('Finding intent for: ', speechText)
    const intent = intents.intents.find((intent) => {
      const sentence = intent.sentences.find((sentence) => {
        sentenceWords = sentence.replace(`{${intent.slot}}`, '').split(' ')
        console.log('Sentence words: ', sentenceWords)

        const match = sentenceWords.every((word) => speechText.includes(word))
        return match
      })
      console.log('Sentence: ', sentence)

      if (sentence) {
        return intent
      }

      return false
    })

    if (!intent) {
      console.log('No intent found')
      return false
    }

    console.log('Found intent: ', intent)

    const remainingWords = speechText
      .split(' ')
      .filter((word) => !sentenceWords.includes(word))
      .join(' ')

    // console.log('LIGHTS: ', this.lights)
    console.log('Remaining words: ', remainingWords)

    // this.lights.forEach((light) => {
    //   console.log('entity id: ', light.entity_id)
    //   console.log('friendly name: ', light.attributes.friendly_name)
    // })
    const foundEntity = this.lights.find((entity) => {
      const entityName =
        entity.attributes && entity.attributes.friendly_name.toLowerCase()
      const nameParts = entityName.split(' ')
      const found = nameParts.every((part) =>
        remainingWords.toLowerCase().includes(part)
      )
      return found
    })

    console.log('found entity: ', foundEntity)
    return foundEntity
  }
}

function filterWords(text) {}
