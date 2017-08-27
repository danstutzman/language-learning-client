import ExpIdSeq from '../js/exp/ExpIdSeq'
import fs       from 'fs'
import path     from 'path'
import yaml     from 'js-yaml'
import VCloud from '../js/exp/verbs/VCloud'

const expIdSeq = new ExpIdSeq()
const vCloud = new VCloud(expIdSeq)

function parse(input: string) {
  let parsed = []
  let words = input.split(' ')
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    if (i === 0) {
      word = word.toLowerCase()
    }
    if (word.match(/[.?]$/)) {
      word = word.substring(0, word.length - 1)
    }

    const v = vCloud.findByEs(word)
    if (v.length > 1) {
      throw new Error(`Too many verbs found for ${word}`)
    } else if (v.length == 1) {
      parsed.push(v[0].toMorphemes())
    } else {
      parsed.push(word)
    }
  }
  return parsed
}

const sentencesPath = path.resolve(__dirname, 'pimsleur.yaml')
const sentencesYaml = fs.readFileSync(sentencesPath, 'UTF-8')
const categoryToDefinitions = yaml.safeLoad(sentencesYaml)
for (const qaPair of categoryToDefinitions['QA_OF_2ND_PERSON']) {
  const parts = qaPair.normalize('NFC').split('  ')
  if (parts.length !== 2) {
    throw new Error(`Missing double-space in ${qaPair}`)
  }
  const q = parts[0]
  console.log(q, parse(q))
  const a = parts[1]
  console.log(a, parse(a))
}
